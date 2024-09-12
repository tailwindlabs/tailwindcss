import { rule, walk, type AstNode } from '../../ast'

export function migrateTailwindDirectives(ast: AstNode[]) {
  let baseNode: AstNode | null = null
  let utilitiesNode: AstNode | null = null

  let defaultImportNode: AstNode | null = null
  let utilitiesImportNode: AstNode | null = null
  let preflightImportNode: AstNode | null = null
  let themeImportNode: AstNode | null = null

  walk(ast, (node, { replaceWith }) => {
    if (node.kind !== 'rule' || node.selector[0] !== '@') return

    // Track if new imports are already present
    if (node.selector.match(/^@import ["']tailwindcss["']$/)) {
      defaultImportNode = node
    } else if (node.selector.match(/^@import ["']tailwindcss\/utilities["'] layer/)) {
      utilitiesImportNode = node
    } else if (node.selector.match(/^@import ["']tailwindcss\/preflight["'] layer/)) {
      preflightImportNode = node
    } else if (node.selector.match(/^@import ["']tailwindcss\/theme["'] layer/)) {
      themeImportNode = node
    }

    // Track old imports and directives
    else if (
      node.selector === '@tailwind base' ||
      node.selector.match(/^@import ["']tailwindcss\/base["']$/)
    ) {
      baseNode = node
      replaceWith([])
    } else if (
      node.selector === '@tailwind utilities' ||
      node.selector.match(/^@import ["']tailwindcss\/utilities["']$/)
    ) {
      utilitiesNode = node
      replaceWith([])
    }

    // Remove directives that are not needed anymore
    else if (
      node.selector === '@tailwind components' ||
      node.selector === '@tailwind screens' ||
      node.selector === '@tailwind variants' ||
      node.selector.match(/^@import ["']tailwindcss\/components["']$/)
    ) {
      replaceWith([])
    }
  })

  // Insert default import if all directives are present
  if (baseNode !== null && utilitiesNode !== null) {
    if (!defaultImportNode) {
      ast.unshift(rule("@import 'tailwindcss'", []))
    }
  }

  // Insert individual imports if not all directives are present
  else if (utilitiesNode !== null) {
    if (!utilitiesImportNode) {
      ast.unshift(rule("@import 'tailwindcss/utilities' layer(utilities)", []))
    }
  } else if (baseNode !== null) {
    if (!preflightImportNode) {
      ast.unshift(rule("@import 'tailwindcss/preflight' layer(base)", []))
    }
    if (!themeImportNode) {
      ast.unshift(rule("@import 'tailwindcss/theme' layer(theme)", []))
    }
  }
}
