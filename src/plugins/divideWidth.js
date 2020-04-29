import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants, target }) {
    if (target('divideWidth') === 'ie11') {
      const generators = [
        (size, modifier) => ({
          [`.${e(`divide-y${modifier}`)} > :not(template) ~ :not(template)`]: {
            'border-top-width': size,
          },
          [`.${e(`divide-x${modifier}`)} > :not(template) ~ :not(template)`]: {
            'border-left-width': size,
          },
        }),
      ]

      const utilities = _.flatMap(generators, generator => {
        return _.flatMap(theme('divideWidth'), (value, modifier) => {
          return generator(value, modifier === 'default' ? '' : `-${modifier}`)
        })
      })

      addUtilities(utilities, variants('divideWidth'))

      return
    }

    const generators = [
      (size, modifier) => ({
        [`.${e(`divide-y${modifier}`)} > :not(template) ~ :not(template)`]: {
          '--divide-y-reverse': '0',
          'border-top-width': `calc(${
            size === '0' ? '0px' : size
          } * calc(1 - var(--divide-y-reverse)))`,
          'border-bottom-width': `calc(${size === '0' ? '0px' : size} * var(--divide-y-reverse))`,
        },
        [`.${e(`divide-x${modifier}`)} > :not(template) ~ :not(template)`]: {
          '--divide-x-reverse': '0',
          'border-right-width': `calc(${size === '0' ? '0px' : size} * var(--divide-x-reverse))`,
          'border-left-width': `calc(${
            size === '0' ? '0px' : size
          } * calc(1 - var(--divide-x-reverse)))`,
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
