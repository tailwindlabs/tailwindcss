import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const generators = [
      (value, modifier) => ({
        [nameClass('border', modifier)]: { borderWidth: `${value}` },
      }),
      (value, modifier) => ({
        [nameClass('border-t', modifier)]: { borderTopWidth: `${value}` },
        [nameClass('border-r', modifier)]: { borderRightWidth: `${value}` },
        [nameClass('border-b', modifier)]: { borderBottomWidth: `${value}` },
        [nameClass('border-l', modifier)]: { borderLeftWidth: `${value}` },
      }),
    ]

    const utilities = _.flatMap(generators, (generator) => {
      return _.flatMap(theme('borderWidth'), (value, modifier) => {
        return generator(value, modifier)
      })
    })

    addUtilities(utilities, variants('borderWidth'))
  }
}
