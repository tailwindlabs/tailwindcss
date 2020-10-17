import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [nameClass('m', modifier)]: { margin: `${size}` },
      }),
      (size, modifier) => ({
        [nameClass('my', modifier)]: {
          'margin-top': `${size}`,
          'margin-bottom': `${size}`,
        },
        [nameClass('mx', modifier)]: {
          'margin-left': `${size}`,
          'margin-right': `${size}`,
        },
      }),
      (size, modifier) => ({
        [nameClass('mt', modifier)]: { 'margin-top': `${size}` },
        [nameClass('mr', modifier)]: { 'margin-right': `${size}` },
        [nameClass('mb', modifier)]: { 'margin-bottom': `${size}` },
        [nameClass('ml', modifier)]: { 'margin-left': `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, (generator) => {
      return _.flatMap(theme('margin'), generator)
    })

    addUtilities(utilities, variants('margin'))
  }
}
