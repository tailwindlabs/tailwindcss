import { withAlphaValue } from '../util/withAlphaVariable'

export default function () {
  return function ({ config, matchUtilities, addBase, addUtilities, theme, variants }) {
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

    if (config('mode') === 'jit') {
      addBase(ringReset)
    } else {
      addUtilities(ringReset, { respectImportant: false })
    }

    matchUtilities(
      {
        ring: (value) => {
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
