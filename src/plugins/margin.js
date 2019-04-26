import _ from 'lodash'
import prefixNegativeModifiers from '../util/prefixNegativeModifiers'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(prefixNegativeModifiers('m', modifier))}`]: { margin: `${size}` },
      }),
      (size, modifier) => ({
        [`.${e(prefixNegativeModifiers('my', modifier))}`]: {
          'margin-top': `${size}`,
          'margin-bottom': `${size}`,
        },
        [`.${e(prefixNegativeModifiers('mx', modifier))}`]: {
          'margin-left': `${size}`,
          'margin-right': `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(prefixNegativeModifiers('mt', modifier))}`]: { 'margin-top': `${size}` },
        [`.${e(prefixNegativeModifiers('mr', modifier))}`]: { 'margin-right': `${size}` },
        [`.${e(prefixNegativeModifiers('mb', modifier))}`]: { 'margin-bottom': `${size}` },
        [`.${e(prefixNegativeModifiers('ml', modifier))}`]: { 'margin-left': `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('margin'), generator)
    })

    addUtilities(utilities, variants('margin'))
  }
}
