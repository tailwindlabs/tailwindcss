import { context, rule, walk, WalkAction, type AstNode } from './ast'
import * as CSS from './css-parser'
import * as ValueParser from './value-parser'

type LoadStylesheet = (id: string, basedir: string) => Promise<{ base: string; content: string }>

export async function substituteAtImports(
  ast: AstNode[],
  base: string,
  loadStylesheet: LoadStylesheet,
  recurseCount = 0,
) {
  let promises: Promise<void>[] = []

  walk(ast, (node, { replaceWith }) => {
    if (
      node.kind === 'rule' &&
      node.selector[0] === '@' &&
      node.selector.toLowerCase().startsWith('@import ')
    ) {
      try {
        let { uri, layer, media, supports } = parseImportParams(
          ValueParser.parse(node.selector.slice(8)),
        )

        // Skip importing data or remote URIs
        if (uri.startsWith('data:')) return
        if (uri.startsWith('http://') || uri.startsWith('https://')) return

        let contextNode = context({}, [])

        promises.push(
          (async () => {
            // Since we do not have fully resolved paths in core, we can't reliably detect circular
            // imports. Instead, we try to limit the recursion depth to a number that is too large
            // to be reached in practice.
            if (recurseCount > 100) {
              throw new Error(
                `Exceeded maximum recursion depth while resolving \`${uri}\` in \`${base}\`)`,
              )
            }

            const loaded = await loadStylesheet(uri, base)
            let ast = CSS.parse(loaded.content)
            await substituteAtImports(ast, loaded.base, loadStylesheet, recurseCount + 1)

            contextNode.nodes = buildImportNodes(
              [context({ base: loaded.base }, ast)],
              layer,
              media,
              supports,
            )
          })(),
        )

        replaceWith(contextNode)
        // The resolved Stylesheets already have their transitive @imports
        // resolved, so we can skip walking them.
        return WalkAction.Skip
      } catch (e: any) {
        // When an error occurs while parsing the `@import` statement, we skip
        // the import.
      }
    }
  })

  await Promise.all(promises)
}

// Modified and inlined version of `parse-statements` from
// `postcss-import` <https://github.com/postcss/postcss-import>
// Copyright (c) 2014 Maxime Thirouin, Jason Campbell & Kevin Mårtensson
// Released under the MIT License.
export function parseImportParams(params: ValueParser.ValueAstNode[]) {
  let uri
  let layer: string | null = null
  let media: string | null = null
  let supports: string | null = null

  for (let i = 0; i < params.length; i++) {
    const node = params[i]

    if (node.kind === 'separator') continue

    if (node.kind === 'word' && !uri) {
      if (!node.value) throw new Error(`Unable to find uri`)
      if (node.value[0] !== '"' && node.value[0] !== "'") throw new Error('Unable to find uri')

      uri = node.value.slice(1, -1)
      continue
    }

    if (node.kind === 'function' && node.value.toLowerCase() === 'url') {
      throw new Error('url functions are not supported')
    }

    if (!uri) throw new Error('Unable to find uri')

    if (
      (node.kind === 'word' || node.kind === 'function') &&
      node.value.toLowerCase() === 'layer'
    ) {
      if (layer) throw new Error('Multiple layers')
      if (supports) throw new Error('layers must be defined before support conditions')

      if ('nodes' in node) {
        layer = ValueParser.toCss(node.nodes)
      } else {
        layer = ''
      }

      continue
    }

    if (node.kind === 'function' && node.value.toLowerCase() === 'supports') {
      if (supports) throw new Error('Multiple support conditions')
      supports = ValueParser.toCss(node.nodes)
      continue
    }

    media = ValueParser.toCss(params.slice(i))
    break
  }

  if (!uri) throw new Error('Unable to find uri')

  return { uri, layer, media, supports }
}

function buildImportNodes(
  importedAst: AstNode[],
  layer: string | null,
  media: string | null,
  supports: string | null,
): AstNode[] {
  let root = importedAst

  if (layer !== null) {
    root = [rule('@layer ' + layer, root)]
  }

  if (media !== null) {
    root = [rule('@media ' + media, root)]
  }

  if (supports !== null) {
    root = [rule(`@supports ${supports[0] === '(' ? supports : `(${supports})`}`, root)]
  }

  return root
}
