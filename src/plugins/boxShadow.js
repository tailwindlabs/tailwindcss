import transformThemeValue from '../util/transformThemeValue'

let transformValue = transformThemeValue('boxShadow')
let defaultBoxShadow = [
  `var(--tw-ring-offset-shadow, 0 0 #0000)`,
  `var(--tw-ring-shadow, 0 0 #0000)`,
  `var(--tw-shadow)`,
].join(', ')

export default function () {
  return function ({ matchUtilities, addBase, theme, variants }) {
    addBase({
      '@defaults box-shadow': {
        '--tw-ring-offset-shadow': '0 0 #0000',
        '--tw-ring-shadow': '0 0 #0000',
        '--tw-shadow': '0 0 #0000',
      },
    })

    matchUtilities(
      {
        shadow: (value) => {
          value = transformValue(value)

          return {
            '@defaults box-shadow': {},
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
