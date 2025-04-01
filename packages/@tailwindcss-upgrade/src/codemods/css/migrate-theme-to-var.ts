import { type Plugin } from 'postcss'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { Convert, createConverter } from '../template/migrate-theme-to-var'

export function migrateThemeToVar({
  designSystem,
}: {
  designSystem?: DesignSystem
} = {}): Plugin {
  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-theme-to-var',
    OnceExit(root) {
      if (!designSystem) return
      let convert = createConverter(designSystem, { prettyPrint: true })

      root.walkDecls((decl) => {
        let [newValue] = convert(decl.value)
        decl.value = newValue
      })

      root.walkAtRules((atRule) => {
        if (
          atRule.name === 'media' ||
          atRule.name === 'custom-media' ||
          atRule.name === 'container' ||
          atRule.name === 'supports'
        ) {
          let [newValue] = convert(atRule.params, Convert.MigrateThemeOnly)
          atRule.params = newValue
        }
      })
    },
  }
}
