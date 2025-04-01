import type { AtRule, Plugin } from 'postcss'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { migrateCandidate } from '../template/migrate'

export function migrateAtApply({
  designSystem,
  userConfig,
}: {
  designSystem: DesignSystem
  userConfig: Config
}): Plugin {
  function migrate(atRule: AtRule) {
    let utilities = atRule.params.split(/(\s+)/)
    let important =
      utilities[utilities.length - 1] === '!important' ||
      utilities[utilities.length - 1] === '#{!important}' // Sass/SCSS

    if (important) utilities.pop() // Remove `!important`

    let params = utilities.map((part) => {
      // Keep whitespace
      if (part.trim() === '') return part
      let variants = segment(part, ':')
      let utility = variants.pop()!

      // Apply the important modifier to all the rules if necessary
      if (important && utility[0] !== '!' && utility[utility.length - 1] !== '!') {
        utility += '!'
      }

      // Reconstruct the utility with the variants
      return [...variants, utility].join(':')
    })

    return async () => {
      // If we have a valid designSystem and config setup, we can run all
      // candidate migrations on each utility
      params = await Promise.all(
        params.map(async (param) => await migrateCandidate(designSystem, userConfig, param)),
      )

      atRule.params = params.join('').trim()
    }
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-at-apply',
    async OnceExit(root) {
      let migrations: (() => void)[] = []
      root.walkAtRules('apply', (atRule) => {
        migrations.push(migrate(atRule))
      })

      await Promise.allSettled(migrations.map((m) => m()))
    },
  }
}
