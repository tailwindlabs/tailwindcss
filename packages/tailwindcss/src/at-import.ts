import { context, rule, walk, WalkAction, type AstNode } from './ast'
import * as CSS from './css-parser'
import * as ValueParser from './value-parser'

type LoadStylesheet = (id: string, basedir: string) => Promise<{ base: string; content: string }>

export async function substituteAtImports(
  ast: AstNode[],
  base: string,
  loadStylesheet: LoadStylesheet,
) {
  let promises: Map<string, Promise<{ ast: AstNode[]; base: string }>> = new Map()

  walk(ast, (node) => {
    // Find @import rules and start resolving them
    if (node.kind === 'rule' && node.selector[0] === '@' && node.selector.startsWith('@import ')) {
      let { uri } = parseImportParams(ValueParser.parse(node.selector.slice(8)))

      // Skip importing data URIs
      if (uri.startsWith('data:')) return

      promises.set(key(uri, base), resolveAtImport(uri, base, loadStylesheet))
    }
  })

  let entries = [...promises.entries()]
  let resolvers = entries.map(async ([id, promise]) => [id, await promise] as const)
  let resolved = await Promise.all(resolvers)
  let unwrapped = new Map(resolved)

  walk(ast, (node, { replaceWith }) => {
    // Replace all @import rules
    if (node.kind === 'rule' && node.selector[0] === '@' && node.selector.startsWith('@import ')) {
      let { uri, layer, media, supports } = parseImportParams(
        ValueParser.parse(node.selector.slice(8)),
      )
      let imported = unwrapped.get(key(uri, base))
      if (imported) {
        replaceWith(buildImportNodes(imported.ast, imported.base, layer, media, supports))
        return WalkAction.Skip
      }
    }
  })
}

async function resolveAtImport(
  id: string,
  base: string,
  loadStylesheet: LoadStylesheet,
): Promise<{ ast: AstNode[]; base: string }> {
  const { content, base: nestedBase } = await loadStylesheet(id, base)
  let ast = CSS.parse(content)
  await substituteAtImports(ast, nestedBase, loadStylesheet)
  return { ast, base: nestedBase }
}

function key(id: string, basedir: string): string {
  return `${id}:${basedir}`
}

// c.f. https://github.com/postcss/postcss-import/blob/master/lib/parse-statements.js
function parseImportParams(params: ValueParser.ValueAstNode[]) {
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

    if (node.kind === 'function' && /^url$/i.test(node.value)) {
      if (uri) throw new Error("Multiple url's")
      if (!node.nodes?.[0]?.value) throw new Error('Unable to find uri')
      if (node.nodes[0].value[0] !== '"' && node.nodes[0].value[0] !== "'")
        throw new Error('Unable to find uri')

      uri = node.nodes[0].value.slice(1, -1)
      continue
    }

    if (!uri) throw new Error('Unable to find uri')

    if ((node.kind === 'word' || node.kind === 'function') && /^layer$/i.test(node.value)) {
      if (layer) throw new Error('Multiple layers')
      if (supports) throw new Error('layers must be defined before support conditions')

      if ('nodes' in node) {
        layer = ValueParser.toCss(node.nodes)
      } else {
        layer = ''
      }

      continue
    }

    if (node.kind === 'function' && /^supports$/i.test(node.value)) {
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
  base: string,
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

  return [context({ base }, root)]
}
