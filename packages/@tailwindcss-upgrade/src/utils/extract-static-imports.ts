import Parser from 'tree-sitter'
import TS from 'tree-sitter-typescript'

let parser = new Parser()
parser.setLanguage(TS.typescript)
const treesitter = String.raw

const PLUGINS_QUERY = new Parser.Query(
  TS.typescript,
  treesitter`
    ; export default = {}
    (export_statement
      value: (satisfies_expression (object
        (pair
          key: (property_identifier) @name (#eq? @name "plugins")
          value: (array) @imports
        )
      ))?
      value: (as_expression (object
        (pair
          key: (property_identifier) @name (#eq? @name "plugins")
          value: (array) @imports
        )
      ))?
      value: (object
        (pair
          key: (property_identifier) @name (#eq? @name "plugins")
          value: (array) @imports
        )
      )?
    )

    ; module.exports = {}
    (expression_statement
      (assignment_expression
        left: (member_expression) @left (#eq? @left "module.exports")
        right: (satisfies_expression (object
          (pair
            key: (property_identifier) @name (#eq? @name "plugins")
            value: (array) @imports
          )
        ))?
        right: (as_expression (object
          (pair
            key: (property_identifier) @name (#eq? @name "plugins")
            value: (array) @imports
          )
        ))?
        right: (object
          (pair
            key: (property_identifier) @name (#eq? @name "plugins")
            value: (array) @imports
          )
        )?
      )
    )

  `,
)
export function findSimplePlugins(source: string): string[] | null {
  try {
    let tree = parser.parse(source)
    let root = tree.rootNode

    let imports = extractStaticImportMap(source)
    let captures = PLUGINS_QUERY.matches(root)

    let plugins = []
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
              if (!source || (source.export !== null && source.export !== '*')) {
                return null
              }
              plugins.push(source.module)
              break
            case 'string':
              plugins.push(pluginDefinition.children[1].text)
              break
            default:
              return null
          }
        }
      }
    }
    return plugins
  } catch (error) {
    console.error(error)
    return null
  }
}

const ESM_IMPORT_QUERY = new Parser.Query(
  TS.typescript,
  treesitter`
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
    )`,
)

export function extractStaticImportMap(source: string) {
  let tree = parser.parse(source)
  let root = tree.rootNode

  let captures = ESM_IMPORT_QUERY.matches(root)

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
