import { type Plugin, type Root } from 'postcss'
import type { Config } from 'tailwindcss'
import { resolveConfig } from '../../../tailwindcss/src/compat/config/resolve-config'
import { buildMediaQuery } from '../../../tailwindcss/src/compat/screens-config'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../tailwindcss/src/utils/default-map'

export function migrateMediaScreen({
  designSystem,
  userConfig,
}: {
  designSystem?: DesignSystem
  userConfig?: Config
} = {}): Plugin {
  function migrate(root: Root) {
    if (!designSystem || !userConfig) return

    let resolvedUserConfig = resolveConfig(designSystem, [{ base: '', config: userConfig }])
    let screens = resolvedUserConfig?.theme?.screens || {}

    let mediaQueries = new DefaultMap<string, string | null>((name) => {
      let value = designSystem?.resolveThemeValue(`--breakpoint-${name}`) ?? screens?.[name]
      return value ? buildMediaQuery(value) : null
    })

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
