import { withAlphaValue } from '../util/withAlphaVariable'

export default function () {
  return function ({ matchUtilities, addBase, addUtilities, theme, variants }) {
    let ringOpacityDefault = theme('ringOpacity.DEFAULT', '0.5')
    let ringColorDefault = withAlphaValue(
      theme('ringColor.DEFAULT'),
      ringOpacityDefault,
      `rgba(147, 197, 253, ${ringOpacityDefault})`
    )

    addBase({
      '@defaults ring-width': {
        '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
        '--tw-ring-offset-width': theme('ringOffsetWidth.DEFAULT', '0px'),
        '--tw-ring-offset-color': theme('ringOffsetColor.DEFAULT', '#fff'),
        '--tw-ring-color': ringColorDefault,
        '--tw-ring-offset-shadow': '0 0 #0000',
        '--tw-ring-shadow': '0 0 #0000',
        '--tw-shadow': '0 0 #0000',
      },
    })

    matchUtilities(
      {
        ring: (value) => {
          return {
            '@defaults ring-width': {},
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

    addUtilities(
      {
        '.ring-inset': {
          '@defaults ring-width': {},
          '--tw-ring-inset': 'inset',
        },
      },
      variants('ringWidth')
    )
  }
}
