import Parser from 'tree-sitter'
import TS from 'tree-sitter-typescript'

console.log({ TS })
let parser = new Parser()
parser.setLanguage(TS.typescript)
const treesitter = String.raw

const IMPORT_QUERY = new Parser.Query(
  TS.typescript,
  treesitter`
    ; import foo, {foo as bar} from './foo'
    (import_statement
      (import_clause
        (identifier)? @default
          (named_imports
            (import_specifier
              name: (identifier) @imported-name
                  alias: (identifier)? @imported-alias
                )
          )?
      )
      (string
        (string_fragment) @imported-from)
    )`,

  //   ; import * as foo from './foo'
  //   (import_statement
  //     (import_clause
  //       (namespace_import
  //     		(identifier) @imported-name))
  //       (string
  //         (string_fragment) @imported-from)
  //   )
  // `,
)

export function extractStaticImportMap(source: string) {
  let tree = parser.parse(source)
  let root = tree.rootNode

  let captures = IMPORT_QUERY.matches(root)

  let imports: Record<string, { module: string; export: string | null }> = {}
  for (let match of captures) {
    let toImport: { name: string; source: null | string }[] = []
    let from = ''
    for (let i = 0; i < match.captures.length; i++) {
      let capture = match.captures[i]

      switch (capture.name) {
        case 'default':
          toImport.push({ name: capture.node.text, source: null })
          break
        case 'imported-name':
          toImport.push({ name: capture.node.text, source: capture.node.text })
          break
        case 'imported-from':
          from = capture.node.text
          break
        case 'imported-alias':
          if (toImport.length < 1) {
            throw new Error()
          }
          let prevImport = toImport[toImport.length - 1]
          let name = prevImport.name
          prevImport.source = name
          prevImport.name = capture.node.text
          break
      }
    }

    for (let { name, source } of toImport) {
      imports[name] = { module: from, export: source }
    }

    // console.log({ imported, from })

    // console.log(match.captures.map((c) => ({ name: c.name, text: c.node.text })))
    // console.log('+++++++++++++++++++++++++==')
    // let name = match.captures.find((c) => c.name === 'imported-name')
    // let from = match.captures.find((c) => c.name === 'imported-from')

    // if (!name || !from) continue

    // imports[name.node.text] = { module: from.node.text, export: null }
  }

  return imports
}

const PLUGINS_QUERY = new Parser.Query(
  TS.typescript,
  treesitter`
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
  `,
)
export function findSimplePlugins(source: string): string[] | null {
  try {
    let tree = parser.parse(source)
    let root = tree.rootNode

    let imports = extractStaticImportMap(source)
    let captures = PLUGINS_QUERY.matches(root)

    console.dir({ captures }, { depth: 4 })

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
              if (!source || source.export !== null) {
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

      // console.log({ imported, from })

      // console.log(match.captures.map((c) => ({ name: c.name, text: c.node.text })))
      // console.log('+++++++++++++++++++++++++==')
      // let name = match.captures.find((c) => c.name === 'imported-name')
      // let from = match.captures.find((c) => c.name === 'imported-from')

      // if (!name || !from) continue

      // imports[name.node.text] = { module: from.node.text, export: null }
    }
    return plugins
  } catch (error) {
    console.error(error)
    return null
  }
}
