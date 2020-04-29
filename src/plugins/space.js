import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, theme, variants, target }) {
    if (target('space') === 'ie11') {
      const generators = [
        (size, modifier) => ({
          [`.${e(
            prefixNegativeModifiers('space-y', modifier)
          )} > :not(template) ~ :not(template)`]: {
            'margin-top': size,
          },
          [`.${e(
            prefixNegativeModifiers('space-x', modifier)
          )} > :not(template) ~ :not(template)`]: {
            'margin-left': size,
          },
        }),
      ]

      const utilities = _.flatMap(generators, generator => {
        return _.flatMap(theme('space'), generator)
      })

      addUtilities(utilities, variants('space'))

      return
    }

    const generators = [
      (size, modifier) => ({
        [`.${e(prefixNegativeModifiers('space-y', modifier))} > :not(template) ~ :not(template)`]: {
          '--space-y-reverse': '0',
          'margin-top': `calc(${size === '0' ? '0px' : size} * calc(1 - var(--space-y-reverse)))`,
          'margin-bottom': `calc(${size === '0' ? '0px' : size} * var(--space-y-reverse))`,
        },
        [`.${e(prefixNegativeModifiers('space-x', modifier))} > :not(template) ~ :not(template)`]: {
          '--space-x-reverse': '0',
          'margin-right': `calc(${size === '0' ? '0px' : size} * var(--space-x-reverse))`,
          'margin-left': `calc(${size === '0' ? '0px' : size} * calc(1 - var(--space-x-reverse)))`,
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
