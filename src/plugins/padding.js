import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [nameClass('p', modifier)]: { padding: `${size}` },
      }),
      (size, modifier) => ({
        [nameClass('py', modifier)]: { 'padding-top': `${size}`, 'padding-bottom': `${size}` },
        [nameClass('px', modifier)]: { 'padding-left': `${size}`, 'padding-right': `${size}` },
      }),
      (size, modifier) => ({
        [nameClass('pt', modifier)]: { 'padding-top': `${size}` },
        [nameClass('pr', modifier)]: { 'padding-right': `${size}` },
        [nameClass('pb', modifier)]: { 'padding-bottom': `${size}` },
        [nameClass('pl', modifier)]: { 'padding-left': `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, (generator) => {
      return _.flatMap(theme('padding'), generator)
    })

    addUtilities(utilities, variants('padding'))
  }
}
