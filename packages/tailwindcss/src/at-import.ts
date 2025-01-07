import { Features } from '.'
import { atRule, context, walk, WalkAction, type AstNode } from './ast'
import * as CSS from './css-parser'
import * as ValueParser from './value-parser'

type LoadStylesheet = (id: string, basedir: string) => Promise<{ base: string; content: string }>

export async function substituteAtImports(
  ast: AstNode[],
  base: string,
  loadStylesheet: LoadStylesheet,
  recurseCount = 0,
) {
  let features = Features.None
  let promises: Promise<void>[] = []

  walk(ast, (node, { replaceWith }) => {
    if (node.kind === 'at-rule' && (node.name === '@import' || node.name === '@reference')) {
      let parsed = parseImportParams(ValueParser.parse(node.params))
      if (parsed === null) return
      if (node.name === '@reference') {
        parsed.media = 'reference'
      }

      features |= Features.AtImport

      let { uri, layer, media, supports } = parsed

      // Skip importing data or remote URIs
      if (uri.startsWith('data:')) return
      if (uri.startsWith('http://') || uri.startsWith('https://')) return

      let contextNode = context({}, [])

      promises.push(
        (async () => {
          // Since we do not have fully resolved paths in core, we can't
          // reliably detect circular imports. Instead, we try to limit the
          // recursion depth to a number that is too large to be reached in
          // practice.
          if (recurseCount > 100) {
            throw new Error(
              `Exceeded maximum recursion depth while resolving \`${uri}\` in \`${base}\`)`,
            )
          }

          let loaded = await loadStylesheet(uri, base)
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
    }
  })

  if (promises.length > 0) {
    await Promise.all(promises)
  }

  return features
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
    let node = params[i]

    if (node.kind === 'separator') continue

    if (node.kind === 'word' && !uri) {
      if (!node.value) return null
      if (node.value[0] !== '"' && node.value[0] !== "'") return null

      uri = node.value.slice(1, -1)
      continue
    }

    if (node.kind === 'function' && node.value.toLowerCase() === 'url') {
      // `@import` with `url(…)` functions are not inlined but skipped and kept
      // in the final CSS instead.
      // E.g.: `@import url("https://fonts.google.com")`
      return null
    }

    if (!uri) return null

    if (
      (node.kind === 'word' || node.kind === 'function') &&
      node.value.toLowerCase() === 'layer'
    ) {
      if (layer) return null
      if (supports) {
        throw new Error(
          '`layer(…)` in an `@import` should come before any other functions or conditions',
        )
      }

      if ('nodes' in node) {
        layer = ValueParser.toCss(node.nodes)
      } else {
        layer = ''
      }

      continue
    }

    if (node.kind === 'function' && node.value.toLowerCase() === 'supports') {
      if (supports) return null
      supports = ValueParser.toCss(node.nodes)
      continue
    }

    media = ValueParser.toCss(params.slice(i))
    break
  }

  if (!uri) return null

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
    root = [atRule('@layer', layer, root)]
  }

  if (media !== null) {
    root = [atRule('@media', media, root)]
  }

  if (supports !== null) {
    root = [atRule('@supports', supports[0] === '(' ? supports : `(${supports})`, root)]
  }

  return root
}
