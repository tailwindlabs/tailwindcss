import { AtRule, type Plugin, type Root } from 'postcss'

const DEFAULT_LAYER_ORDER = ['theme', 'base', 'components', 'utilities']

export function migrateTailwindDirectives(): Plugin {
  function migrate(root: Root) {
    let baseNode: AtRule | null = null
    let utilitiesNode: AtRule | null = null

    let defaultImportNode: AtRule | null = null
    let utilitiesImportNode: AtRule | null = null
    let preflightImportNode: AtRule | null = null
    let themeImportNode: AtRule | null = null

    let layerOrder: string[] = []

    root.walkAtRules((node) => {
      // Track old imports and directives
      if (
        (node.name === 'tailwind' && node.params === 'base') ||
        (node.name === 'import' && node.params.match(/^["']tailwindcss\/base["']$/))
      ) {
        layerOrder.push('base')
        baseNode = node
        node.remove()
      } else if (
        (node.name === 'tailwind' && node.params === 'utilities') ||
        (node.name === 'import' && node.params.match(/^["']tailwindcss\/utilities["']$/))
      ) {
        layerOrder.push('utilities')
        utilitiesNode = node
        node.remove()
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
    })

    // Insert default import if all directives are present
    if (baseNode !== null && utilitiesNode !== null) {
      if (!defaultImportNode) {
        root.prepend(new AtRule({ name: 'import', params: "'tailwindcss'" }))
      }
    }

    // Insert individual imports if not all directives are present
    else if (utilitiesNode !== null) {
      if (!utilitiesImportNode) {
        root.prepend(
          new AtRule({ name: 'import', params: "'tailwindcss/utilities' layer(utilities)" }),
        )
      }
    } else if (baseNode !== null) {
      if (!preflightImportNode) {
        root.prepend(new AtRule({ name: 'import', params: "'tailwindcss/preflight' layer(base)" }))
      }
      if (!themeImportNode) {
        root.prepend(new AtRule({ name: 'import', params: "'tailwindcss/theme' layer(theme)" }))
      }
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
    Once: migrate,
  }
}
