import { withAlphaValue } from '../util/withAlphaVariable'
import postcss from 'postcss'
import parseObjectStyles from '../util/parseObjectStyles'

let baseRulesKey = Symbol()

export function addBaseSelector(memory, theme, selector) {
  let baseRoot = memory.get(baseRulesKey)

  if (baseRoot.nodes.length === 0) {
    let ringOpacityDefault = theme('ringOpacity.DEFAULT', '0.5')
    let ringColorDefault = withAlphaValue(
      theme('ringColor.DEFAULT'),
      ringOpacityDefault,
      `rgba(147, 197, 253, ${ringOpacityDefault})`
    )

    baseRoot.append(
      parseObjectStyles({
        [selector]: {
          '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-ring-offset-width': theme('ringOffsetWidth.DEFAULT', '0px'),
          '--tw-ring-offset-color': theme('ringOffsetColor.DEFAULT', '#fff'),
          '--tw-ring-color': ringColorDefault,
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

export default function () {
  return function ({ config, matchUtilities, addBase, addUtilities, theme, variants, memory }) {
    if (config('mode') == 'jit') {
      let baseRoot = postcss.root()
      memory.set(baseRulesKey, baseRoot)
      addBase(baseRoot)
    } else {
      let ringOpacityDefault = theme('ringOpacity.DEFAULT', '0.5')
      let ringColorDefault = withAlphaValue(
        theme('ringColor.DEFAULT'),
        ringOpacityDefault,
        `rgba(147, 197, 253, ${ringOpacityDefault})`
      )

      let ringReset = {
        '*, ::before, ::after': {
          '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
          '--tw-ring-offset-width': theme('ringOffsetWidth.DEFAULT', '0px'),
          '--tw-ring-offset-color': theme('ringOffsetColor.DEFAULT', '#fff'),
          '--tw-ring-color': ringColorDefault,
          '--tw-ring-offset-shadow': '0 0 #0000',
          '--tw-ring-shadow': '0 0 #0000',
        },
      }
      addUtilities(ringReset, { respectImportant: false })
    }

    matchUtilities(
      {
        ring: (value, { selector }) => {
          if (config('mode') === 'jit') {
            addBaseSelector(memory, theme, selector)
          }

          return {
            '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
            '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
            'box-shadow': [
              `var(--tw-ring-offset-shadow)`,
              `var(--tw-ring-shadow)`,
              `var(--tw-shadow, 0 0 #0000)`,
            ].join(', '),
          }
        },
      },
      {
        values: theme('ringWidth'),
        variants: variants('ringWidth'),
        type: 'length',
      }
    )

    addUtilities({ '.ring-inset': { '--tw-ring-inset': 'inset' } }, variants('ringWidth'))
  }
}
