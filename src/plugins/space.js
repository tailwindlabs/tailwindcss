export default function () {
  return function ({ matchUtilities, addUtilities, theme, variants }) {
    matchUtilities(
      {
        'space-x': (value) => {
          value = value === '0' ? '0px' : value

          return {
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-x-reverse': '0',
              'margin-right': `calc(${value} * var(--tw-space-x-reverse))`,
              'margin-left': `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
            },
          }
        },
        'space-y': (value) => {
          value = value === '0' ? '0px' : value

          return {
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-y-reverse': '0',
              'margin-top': `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
              'margin-bottom': `calc(${value} * var(--tw-space-y-reverse))`,
            },
          }
        },
      },
      {
        values: theme('space'),
        variants: variants('space'),
        type: 'any',
      }
    )

    addUtilities(
      {
        '.space-y-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-y-reverse': '1',
        },
        '.space-x-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '1',
        },
      },
      variants('space')
    )
  }
}
