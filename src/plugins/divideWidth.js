export default function () {
  return function ({ matchUtilities2, addUtilities, theme, variants }) {
    matchUtilities2(
      {
        'divide-x': (value) => {
          value = value === '0' ? '0px' : value

          return {
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-divide-x-reverse': '0',
              'border-right-width': `calc(${value} * var(--tw-divide-x-reverse))`,
              'border-left-width': `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`,
            },
          }
        },
        'divide-y': (value) => {
          value = value === '0' ? '0px' : value

          return {
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-divide-y-reverse': '0',
              'border-top-width': `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`,
              'border-bottom-width': `calc(${value} * var(--tw-divide-y-reverse))`,
            },
          }
        },
      },
      {
        values: theme('divideWidth'),
        variants: variants('divideWidth'),
        type: 'length',
      }
    )

    addUtilities({
      '.divide-y-reverse > :not([hidden]) ~ :not([hidden])': {
        '--tw-divide-y-reverse': '1',
      },
      '.divide-x-reverse > :not([hidden]) ~ :not([hidden])': {
        '--tw-divide-x-reverse': '1',
      },
    })
  }
}
