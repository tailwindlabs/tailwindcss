import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(`space-y-${modifier}`)} > :not(template) ~ :not(template)`]: {
          '--space-y-reverse': '0',
          'margin-top': `calc(${size} * calc(1 - var(--space-y-reverse)))`,
          'margin-bottom': `calc(${size} * var(--space-y-reverse))`,
        },
        [`.${e(`space-x-${modifier}`)} > :not(template) ~ :not(template)`]: {
          '--space-x-reverse': '0',
          'margin-right': `calc(${size} * var(--space-y-reverse))`,
          'margin-left': `calc(${size} * calc(1 - var(--space-y-reverse)))`,
        },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return [
        ..._.flatMap(theme('space'), generator),
        {
          '.space-y-reverse > :not(template) ~ :not(template)': {
            '--space-y-reverse': '1',
          },
          '.space-x-reverse > :not(template) ~ :not(template)': {
            '--space-x-reverse': '1',
          },
        },
      ]
    })

    addUtilities(utilities, variants('space'))
  }
}
