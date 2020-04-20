import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(`divide-y${modifier}`)} > :not(template) ~ :not(template)`]: {
          '--divide-y-reverse': '0',
          'border-top-width': `calc(${size} * calc(1 - var(--divide-y-reverse)))`,
          'border-bottom-width': `calc(${size} * var(--divide-y-reverse))`,
        },
        [`.${e(`divide-x${modifier}`)} > :not(template) ~ :not(template)`]: {
          '--divide-x-reverse': '0',
          'border-right-width': `calc(${size} * var(--divide-y-reverse))`,
          'border-left-width': `calc(${size} * calc(1 - var(--divide-y-reverse)))`,
        },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return [
        ..._.flatMap(theme('divideWidth'), (value, modifier) => {
          return generator(value, modifier === 'default' ? '' : `-${modifier}`)
        }),
        {
          '.divide-y-reverse > :not(template) ~ :not(template)': {
            '--divide-y-reverse': '1',
          },
          '.divide-x-reverse > :not(template) ~ :not(template)': {
            '--divide-x-reverse': '1',
          },
        },
      ]
    })

    addUtilities(utilities, variants('divideWidth'))
  }
}
