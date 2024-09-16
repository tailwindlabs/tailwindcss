import { AtRule, type Plugin, type Root } from 'postcss'

export function migrateTailwindDirectives(): Plugin {
  function migrate(root: Root) {
    let baseNode: AtRule | null = null
    let utilitiesNode: AtRule | null = null

    let defaultImportNode: AtRule | null = null
    let utilitiesImportNode: AtRule | null = null
    let preflightImportNode: AtRule | null = null
    let themeImportNode: AtRule | null = null

    root.walkAtRules((node) => {
      // Track old imports and directives
      if (
        (node.name === 'tailwind' && node.params === 'base') ||
        (node.name === 'import' && node.params.match(/^["']tailwindcss\/base["']$/))
      ) {
        baseNode = node
        node.remove()
      } else if (
        (node.name === 'tailwind' && node.params === 'utilities') ||
        (node.name === 'import' && node.params.match(/^["']tailwindcss\/utilities["']$/))
      ) {
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
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-tailwind-directives',
    Once: migrate,
  }
}
