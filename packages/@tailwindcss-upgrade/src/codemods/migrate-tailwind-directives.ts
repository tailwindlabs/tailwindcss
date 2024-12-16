import { AtRule, type ChildNode, type Plugin, type Root } from 'postcss'

const DEFAULT_LAYER_ORDER = ['theme', 'base', 'components', 'utilities']

export function migrateTailwindDirectives(options: { newPrefix: string | null }): Plugin {
  let prefixParams = options.newPrefix ? ` prefix(${options.newPrefix})` : ''

  function migrate(root: Root) {
    let baseNode = null as AtRule | null
    let utilitiesNode = null as AtRule | null
    let orderedNodes: AtRule[] = []

    let defaultImportNode = null as AtRule | null
    let utilitiesImportNode = null as AtRule | null
    let preflightImportNode = null as AtRule | null
    let themeImportNode = null as AtRule | null

    let layerOrder: string[] = []

    root.walkAtRules((node) => {
      // Migrate legacy `@import "tailwindcss/tailwind.css"`
      if (node.name === 'import' && node.params.match(/^["']tailwindcss\/tailwind\.css["']$/)) {
        node.params = node.params.replace('tailwindcss/tailwind.css', 'tailwindcss')
      }

      // Append any new prefix() param to existing `@import 'tailwindcss'` directives
      if (node.name === 'import' && node.params.match(/^["']tailwindcss["']/)) {
        node.params += prefixParams
      }

      // Track old imports and directives
      else if (
        (node.name === 'tailwind' && node.params === 'base') ||
        (node.name === 'import' && node.params.match(/^["']tailwindcss\/base["']$/))
      ) {
        layerOrder.push('base')
        orderedNodes.push(node)
        baseNode = node
      } else if (
        (node.name === 'tailwind' && node.params === 'utilities') ||
        (node.name === 'import' && node.params.match(/^["']tailwindcss\/utilities["']$/))
      ) {
        layerOrder.push('utilities')
        orderedNodes.push(node)
        utilitiesNode = node
      }

      // Remove directives that are not needed anymore
      else if (
        (node.name === 'tailwind' && node.params === 'components') ||
        (node.name === 'tailwind' && node.params === 'screens') ||
        (node.name === 'tailwind' && node.params === 'variants') ||
        (node.name === 'import' && node.params.match(/^["']tailwindcss\/components["']$/))
      ) {
        node.remove()
      }

      // Replace Tailwind CSS v2 directives that still worked in v3.
      else if (node.name === 'responsive') {
        if (node.nodes) {
          for (let child of node.nodes) {
            child.raws.tailwind_pretty = true
          }
          node.replaceWith(node.nodes)
        } else {
          node.remove()
        }
      }
    })

    // Insert default import if all directives are present
    if (baseNode !== null && utilitiesNode !== null) {
      if (!defaultImportNode) {
        findTargetNode(orderedNodes).before(
          new AtRule({ name: 'import', params: `'tailwindcss'${prefixParams}` }),
        )
      }
      baseNode?.remove()
      utilitiesNode?.remove()
    }

    // Insert individual imports if not all directives are present
    else if (utilitiesNode !== null) {
      if (!utilitiesImportNode) {
        findTargetNode(orderedNodes).before(
          new AtRule({ name: 'import', params: "'tailwindcss/utilities' layer(utilities)" }),
        )
      }
      utilitiesNode?.remove()
    } else if (baseNode !== null) {
      if (!themeImportNode) {
        findTargetNode(orderedNodes).before(
          new AtRule({ name: 'import', params: `'tailwindcss/theme' layer(theme)${prefixParams}` }),
        )
      }

      if (!preflightImportNode) {
        findTargetNode(orderedNodes).before(
          new AtRule({ name: 'import', params: "'tailwindcss/preflight' layer(base)" }),
        )
      }

      baseNode?.remove()
    }

    // Insert `@layer …;` at the top when the order in the CSS was different
    // from the default.
    {
      // Determine if the order is different from the default.
      let sortedLayerOrder = layerOrder.toSorted((a, z) => {
        return DEFAULT_LAYER_ORDER.indexOf(a) - DEFAULT_LAYER_ORDER.indexOf(z)
      })

      if (layerOrder.some((layer, index) => layer !== sortedLayerOrder[index])) {
        // Create a new `@layer` rule with the sorted order.
        let newLayerOrder = DEFAULT_LAYER_ORDER.toSorted((a, z) => {
          return layerOrder.indexOf(a) - layerOrder.indexOf(z)
        })
        root.prepend({ name: 'layer', params: newLayerOrder.join(', ') })
      }
    }
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-tailwind-directives',
    OnceExit: migrate,
  }
}

// Finds the location where we can inject the new `@import` at-rule. This
// guarantees that the `@import` is inserted at the most expected location.
//
// Ideally it's replacing the existing Tailwind directives, but we have to
// ensure that the `@import` is valid in this location or not. If not, we move
// the `@import` up until we find a valid location.
function findTargetNode(nodes: AtRule[]) {
  // Start at the `base` or `utilities` node (whichever comes first), and find
  // the spot where we can insert the new import.
  let target: ChildNode = nodes.at(0)!

  // Only allowed nodes before the `@import` are:
  //
  // - `@charset` at-rule.
  // - `@layer foo, bar, baz;` at-rule to define the order of the layers.
  // - `@import` at-rule to import other CSS files.
  // - Comments.
  //
  // Nodes that cannot exist before the `@import` are:
  //
  // - Any other at-rule.
  // - Any rule.
  let previous = target.prev()
  while (previous) {
    // Rules are not allowed before the `@import`, so we have to at least inject
    // the `@import` before this rule.
    if (previous.type === 'rule') {
      target = previous
    }

    // Some at-rules are allowed before the `@import`.
    if (previous.type === 'atrule') {
      // `@charset` and `@import` are allowed before the `@import`.
      if (previous.name === 'charset' || previous.name === 'import') {
        // Allowed
        previous = previous.prev()
        continue
      }

      // `@layer` without any nodes is allowed before the `@import`.
      else if (previous.name === 'layer' && !previous.nodes) {
        // Allowed
        previous = previous.prev()
        continue
      }

      // Anything other at-rule (`@media`, `@supports`, etc.) is not allowed
      // before the `@import`.
      else {
        target = previous
      }
    }

    // Keep checking the previous node.
    previous = previous.prev()
  }

  return target
}
