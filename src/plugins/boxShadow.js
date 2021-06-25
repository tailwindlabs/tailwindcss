import transformThemeValue from '../util/transformThemeValue'
import postcss from 'postcss'
import parseObjectStyles from '../util/parseObjectStyles'

let baseRulesKey = Symbol()

export function addBaseSelector(memory, selector) {
  let baseRoot = memory.get(baseRulesKey)

  if (baseRoot.nodes.length === 0) {
    baseRoot.append(
      parseObjectStyles({
        [selector]: {
          '--tw-ring-offset-shadow': '0 0 #0000',
          '--tw-ring-shadow': '0 0 #0000',
          '--tw-shadow': '0 0 #0000',
        },
      })
    )
  } else {
    baseRoot.nodes[0].selectors = [...baseRoot.nodes[0].selectors, selector]
  }
}

let transformValue = transformThemeValue('boxShadow')
let defaultBoxShadow = [
  `var(--tw-ring-offset-shadow, 0 0 #0000)`,
  `var(--tw-ring-shadow, 0 0 #0000)`,
  `var(--tw-shadow)`,
].join(', ')

export default function () {
  return function ({ config, matchUtilities, addBase, addUtilities, theme, variants, memory }) {
    if (config('mode') === 'jit') {
      let baseRoot = postcss.root()
      memory.set(baseRulesKey, baseRoot)
      addBase(baseRoot)
    } else {
      addUtilities(
        {
          '*, ::before, ::after': {
            '--tw-shadow': '0 0 #0000',
          },
        },
        { respectImportant: false }
      )
    }

    matchUtilities(
      {
        shadow: (value, { selector }) => {
          if (config('mode') === 'jit') {
            addBaseSelector(memory, selector)
          }

          value = transformValue(value)

          return {
            '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
            'box-shadow': defaultBoxShadow,
          }
        },
      },
      {
        values: theme('boxShadow'),
        variants: variants('boxShadow'),
        type: 'lookup',
      }
    )
  }
}
