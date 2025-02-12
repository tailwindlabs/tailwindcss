import Parser from 'tree-sitter'
import TS from 'tree-sitter-typescript'

let parser = new Parser()
parser.setLanguage(TS.typescript)
const treesitter = String.raw

// Extract `plugins` property of the object export for both ESM and CJS files
const PLUGINS_QUERY = new Parser.Query(
  TS.typescript,
  treesitter`
    ; export default {}
    (export_statement
      value: [
        (satisfies_expression (object
          (pair
            key: (property_identifier) @_name (#eq? @_name "plugins")
            value: (array) @imports
          )
        ))
        value: (as_expression (object
          (pair
            key: (property_identifier) @_name (#eq? @_name "plugins")
            value: (array) @imports
          )
        ))
        value: (object
          (pair
            key: (property_identifier) @_name (#eq? @_name "plugins")
            value: (array) @imports
          )
        )
      ]
    )

    ; module.exports = {}
    (expression_statement
      (assignment_expression
        left: (member_expression) @left (#eq? @left "module.exports")
        right: [
          (satisfies_expression (object
            (pair
              key: (property_identifier) @_name (#eq? @_name "plugins")
              value: (array) @imports
            )
          ))
          (as_expression (object
            (pair
              key: (property_identifier) @_name (#eq? @_name "plugins")
              value: (array) @imports
            )
          ))
          (object
            (pair
              key: (property_identifier) @_name (#eq? @_name "plugins")
              value: (array) @imports
            )
          )
        ]
      )
    )
  `,
)

// Extract require() calls, as well as identifiers with options or require()
// with options
const PLUGIN_CALL_OPTIONS_QUERY = new Parser.Query(
  TS.typescript,
  treesitter`
    (call_expression
      function: [
        (call_expression
          function: (identifier) @_name (#eq? @_name "require")
          arguments: (arguments
            (string (string_fragment) @module_string)
          )
        )
        (identifier) @module_identifier
      ]
      arguments: [
        (arguments
          (object
            (pair
              key: [
                (property_identifier) @property
                (string (string_fragment) @property)
              ]

              value: [
                (string (string_fragment) @str_value)
                (template_string
                  . (string_fragment) @str_value
                  ; If the template string has more than exactly one string
                  ; fragment at the top, the migration should bail.
                  _ @error
                )
                (number) @num_value
                (true) @true_value
                (false) @false_value
                (null) @null_value
                (array [
                  (string (string_fragment) @str_value)
                  (template_string (string_fragment) @str_value)
                  (number) @num_value
                  (true) @true_value
                  (false) @false_value
                  (null) @null_value
                ]) @array_value
              ]
            )
          )
        )
        (arguments) @_empty_args (#eq? @_empty_args "()")
      ]
    )
    (call_expression
      function: (identifier) @_name (#eq? @_name "require")
      arguments: (arguments
      (string (string_fragment) @module_string)
      )
    )
  `,
)

export type StaticPluginOptions = Record<
  string,
  | string
  | number
  | boolean
  | null
  | string
  | number
  | boolean
  | null
  | Array<string | number | boolean | null>
>

export function findStaticPlugins(source: string): [string, null | StaticPluginOptions][] | null {
  try {
    let tree = parser.parse(source)
    let root = tree.rootNode

    let imports = extractStaticImportMap(source)
    let captures = PLUGINS_QUERY.matches(root)

    let plugins: [string, null | StaticPluginOptions][] = []
    for (let match of captures) {
      for (let capture of match.captures) {
        if (capture.name !== 'imports') continue

        for (let pluginDefinition of capture.node.children) {
          if (
            pluginDefinition.type === '[' ||
            pluginDefinition.type === ']' ||
            pluginDefinition.type === ','
          )
            continue

          switch (pluginDefinition.type) {
            case 'identifier':
              let source = imports[pluginDefinition.text]
              if (!source || source.export !== null) {
                return null
              }
              plugins.push([source.module, null])
              break
            case 'string':
              plugins.push([pluginDefinition.children[1].text, null])
              break
            case 'call_expression':
              let matches = PLUGIN_CALL_OPTIONS_QUERY.matches(pluginDefinition)
              if (matches.length === 0) return null

              let moduleName: string | null = null
              let moduleIdentifier: string | null = null

              let options: StaticPluginOptions | null = null
              let lastProperty: string | null = null

              let captures = matches.flatMap((m) => m.captures)
              for (let i = 0; i < captures.length; i++) {
                let capture = captures[i]
                switch (capture.name) {
                  case 'module_identifier': {
                    moduleIdentifier = capture.node.text
                    break
                  }
                  case 'module_string': {
                    moduleName = capture.node.text
                    break
                  }
                  case 'property': {
                    if (lastProperty !== null) return null
                    lastProperty = capture.node.text
                    break
                  }
                  case 'str_value':
                  case 'num_value':
                  case 'null_value':
                  case 'true_value':
                  case 'false_value': {
                    if (lastProperty === null) return null
                    options ??= {}
                    options[lastProperty] = extractValue(capture)
                    lastProperty = null
                    break
                  }
                  case 'array_value': {
                    if (lastProperty === null) return null
                    options ??= {}

                    // Loop over all captures after this one that are on the
                    // same property (it will be one match for any array
                    // element)
                    let array: Array<string | number | boolean | null> = []
                    let lastConsumedIndex = i
                    arrayLoop: for (let j = i + 1; j < captures.length; j++) {
                      let innerCapture = captures[j]

                      switch (innerCapture.name) {
                        case 'property': {
                          if (innerCapture.node.text !== lastProperty) {
                            break arrayLoop
                          }
                          break
                        }
                        case 'str_value':
                        case 'num_value':
                        case 'null_value':
                        case 'true_value':
                        case 'false_value': {
                          array.push(extractValue(innerCapture))
                          lastConsumedIndex = j
                        }
                      }
                    }

                    i = lastConsumedIndex
                    options[lastProperty] = array
                    lastProperty = null
                    break
                  }

                  case '_name':
                  case '_empty_args':
                    break
                  default:
                    return null
                }
              }

              if (lastProperty !== null) return null

              if (moduleIdentifier !== null) {
                let source = imports[moduleIdentifier]
                if (!source || (source.export !== null && source.export !== '*')) {
                  return null
                }
                moduleName = source.module
              }

              if (moduleName === null) {
                return null
              }

              plugins.push([moduleName, options])
              break
            default:
              return null
          }
        }
      }
    }
    return plugins
  } catch (error: any) {
    error(`${error?.message ?? error}`, { prefix: '↳ ' })
    return null
  }
}

// Extract all top-level imports for both ESM and CJS files
const IMPORT_QUERY = new Parser.Query(
  TS.typescript,
  treesitter`
    ; ESM import
    (import_statement
      (import_clause
        (identifier)? @default
        (named_imports
          (import_specifier
            name: (identifier) @imported-name
                alias: (identifier)? @imported-alias
              )
        )?
        (namespace_import (identifier) @imported-namespace)?
      )
      (string
        (string_fragment) @imported-from)
    )

    ; CJS require
    (variable_declarator
      name: (identifier)? @default
      name: (object_pattern
        (shorthand_property_identifier_pattern)? @imported-name
        (pair_pattern
          key: (property_identifier) @imported-name
          value: (identifier) @imported-alias
        )?
        (rest_pattern
          (identifier) @imported-namespace
        )?
      )?
      value: (call_expression
        function: (identifier) @_fn (#eq? @_fn "require")
        arguments: (arguments
          (string
              (string_fragment) @imported-from
            )
        )
      )
    )
  `,
)

export function extractStaticImportMap(source: string) {
  let tree = parser.parse(source)
  let root = tree.rootNode

  let captures = IMPORT_QUERY.matches(root)

  let imports: Record<string, { module: string; export: string | null }> = {}
  for (let match of captures) {
    let toImport: { name: string; export: null | string }[] = []
    let from = ''
    for (let i = 0; i < match.captures.length; i++) {
      let capture = match.captures[i]

      switch (capture.name) {
        case 'default':
          toImport.push({ name: capture.node.text, export: null })
          break
        case 'imported-name':
          toImport.push({ name: capture.node.text, export: capture.node.text })
          break
        case 'imported-from':
          from = capture.node.text
          break
        case 'imported-namespace':
          toImport.push({ name: capture.node.text, export: '*' })
          break
        case 'imported-alias':
          if (toImport.length < 1) {
            throw new Error('Unexpected alias: ' + JSON.stringify(captures, null, 2))
          }
          let prevImport = toImport[toImport.length - 1]
          let name = prevImport.name
          prevImport.export = name
          prevImport.name = capture.node.text
          break
      }
    }

    for (let { name, export: exportSource } of toImport) {
      imports[name] = { module: from, export: exportSource }
    }
  }

  return imports
}

function extractValue(capture: { name: string; node: { text: string } }) {
  return capture.name === 'num_value'
    ? parseFloat(capture.node.text)
    : capture.name === 'null_value'
      ? null
      : capture.name === 'true_value'
        ? true
        : capture.name === 'false_value'
          ? false
          : capture.node.text
}
