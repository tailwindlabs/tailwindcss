import { type Plugin, type Root } from 'postcss'
import { resolveConfig } from '../../../../tailwindcss/src/compat/config/resolve-config'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import { buildMediaQuery } from '../../../../tailwindcss/src/compat/screens-config'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'

export function migrateMediaScreen({
  designSystem,
  userConfig,
}: {
  designSystem?: DesignSystem
  userConfig?: Config
} = {}): Plugin {
  function migrate(root: Root) {
    if (!designSystem || !userConfig) return

    let { resolvedConfig } = resolveConfig(designSystem, [
      { base: '', config: userConfig, reference: false },
    ])
    let screens = resolvedConfig?.theme?.screens || {}

    let mediaQueries = new DefaultMap<string, string | null>((name) => {
      let value = designSystem?.resolveThemeValue(`--breakpoint-${name}`, true) ?? screens?.[name]
      if (typeof value === 'string') return `(width >= theme(--breakpoint-${name}))`
      return value ? buildMediaQuery(value) : null
    })

    // First migrate `@screen md` to `@media screen(md)`
    root.walkAtRules('screen', (node) => {
      node.name = 'media'
      node.params = `screen(${node.params})`
    })

    // Then migrate the `screen(…)` function
    root.walkAtRules((rule) => {
      if (rule.name !== 'media') return

      let screen = rule.params.match(/screen\(([^)]+)\)/)
      if (!screen) return

      let value = mediaQueries.get(screen[1])
      if (!value) return

      rule.params = value
    })
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-media-screen',
    OnceExit: migrate,
  }
}
