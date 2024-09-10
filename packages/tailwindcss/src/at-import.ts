import { walk, WalkAction, type AstNode } from './ast'
import * as CSS from './css-parser'

type ResolveImport = (id: string, basedir: string) => Promise<{ content: string; basedir: string }>

export async function substituteAtImports(
  ast: AstNode[],
  basedir: string,
  resolveImport: ResolveImport,
) {
  let promises: Map<string, Promise<AstNode[]>> = new Map()

  walk(ast, (node) => {
    // Find @import rules and start resolving them
    if (node.kind === 'rule' && node.selector[0] === '@' && node.selector.startsWith('@import ')) {
      let id = node.selector.slice('@import "'.length, -1)
      promises.set(key(id, basedir), resolveAtImport(id, basedir, resolveImport))
    }
  })

  let entries = [...promises.entries()]
  let resolvers = entries.map(async ([id, promise]) => [id, await promise] as const)
  let resolved = await Promise.all(resolvers)
  let unwrapped = new Map(resolved)

  walk(ast, (node, { replaceWith }) => {
    // Replace all @import rules
    if (node.kind === 'rule' && node.selector[0] === '@' && node.selector.startsWith('@import ')) {
      let id = node.selector.slice('@import "'.length, -1)
      let result = unwrapped.get(key(id, basedir))
      if (result) {
        replaceWith(result)
        return WalkAction.Skip
      }
    }
  })
}

async function resolveAtImport(
  id: string,
  basedir: string,
  resolveImport: ResolveImport,
): Promise<AstNode[]> {
  const { content, basedir: nestedBaseDir } = await resolveImport(id, basedir)
  let ast = CSS.parse(content)
  await substituteAtImports(ast, nestedBaseDir, resolveImport)
  return ast
}

function key(id: string, basedir: string): string {
  return `${id}:${basedir}`
}
