import type { AtRule, Plugin } from 'postcss'
import { segment } from '../../../tailwindcss/src/utils/segment'

export function migrateAtApply(): Plugin {
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

      // Migrate the important modifier to the end of the utility
      if (utility[0] === '!') {
        utility = `${utility.slice(1)}!`
      }

      // Reconstruct the utility with the variants
      return [...variants, utility].join(':')
    })

    atRule.params = params.join('').trim()
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-at-apply',
    AtRule: {
      apply: migrate,
    },
  }
}
