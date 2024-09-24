import { type AtRule, type ChildNode, type Plugin, type Root } from 'postcss'

export function hoistImports(): Plugin {
  function migrate(root: Root) {
    let imports: AtRule[] = []

    // Track the node where we want to insert the imports after.
    let after: ChildNode | null = null as ChildNode | null

    // Whether a node that is not an import exists before an import.
    // Except for `@charset` and `@layer foo, bar, baz;`.
    let seenNonImport = false

    // Whether we should hoist the imports.
    let shouldHoist = false

    root.each((node) => {
      // Track the `@import` at-rules, themselves.
      if (node.type === 'atrule' && node.name === 'import') {
        // Once we've seen a non-import node, we should hoist the imports.
        if (seenNonImport) {
          shouldHoist = true
        }

        imports.push(node)
      }

      // The `@charset` at-rule is allowed to exist before the imports.
      else if (node.type === 'atrule' && node.name === 'charset') {
        after = node
      }

      // The `@layer` at-rule without a body is allowed to exist before the
      // imports to define the layer order.
      else if (node.type === 'atrule' && node.name === 'layer' && !node.nodes) {
        after = node
      }

      // Comments are allowed to exist before the imports.
      else if (node.type === 'comment' && imports.length === 0) {
        after = node
      }

      // Once we see a non-import node, we should hoist the imports.
      else {
        seenNonImport = true
      }
    })

    if (shouldHoist) {
      if (after !== null) {
        after.after(imports)
      } else {
        root.prepend(imports)
      }
    }
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/hoist-imports',
    OnceExit: migrate,
  }
}
