import { type Plugin, type Root } from 'postcss'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'

export function migratePrefixConfigOption(designSystem?: DesignSystem): Plugin {
  let prefix = designSystem?.theme.prefix

  // @import "tailwindcss"
  // @import "tailwindcss/theme"
  let IS_TAILWIND_IMPORT = /^["']tailwindcss(\/theme)?["']/
  let HAS_PREFIX = /prefix([^)]+)/

  function migrate(root: Root) {
    // If there's no prefix configured, we don't need to do anything
    if (typeof prefix !== 'string') return

    root.walkAtRules((node) => {
      if (node.name !== 'import') return
      if (!node.params.match(IS_TAILWIND_IMPORT)) return
      if (node.params.match(HAS_PREFIX)) return

      node.params += ` prefix(${prefix})`
    })
  }

  // TODO: We should remove `prefix: "…"` from the config file
  // - if its on its own line just remove the line
  // - if not then just remove the `prefix: "…"` part
  // - do we need to use a JS AST thing for this?
  //
  // The prefix might be in a preset or a plugin so if we don't find it
  // we should just log a warning and let the user handle it themselves

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-prefix-config-option',
    OnceExit: migrate,
  }
}
