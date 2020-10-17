import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const generators = [
      (value, modifier) => ({
        [nameClass('rounded', modifier)]: { borderRadius: `${value}` },
      }),
      (value, modifier) => ({
        [nameClass('rounded-t', modifier)]: {
          borderTopLeftRadius: `${value}`,
          borderTopRightRadius: `${value}`,
        },
        [nameClass('rounded-r', modifier)]: {
          borderTopRightRadius: `${value}`,
          borderBottomRightRadius: `${value}`,
        },
        [nameClass('rounded-b', modifier)]: {
          borderBottomRightRadius: `${value}`,
          borderBottomLeftRadius: `${value}`,
        },
        [nameClass('rounded-l', modifier)]: {
          borderTopLeftRadius: `${value}`,
          borderBottomLeftRadius: `${value}`,
        },
      }),
      (value, modifier) => ({
        [nameClass('rounded-tl', modifier)]: { borderTopLeftRadius: `${value}` },
        [nameClass('rounded-tr', modifier)]: { borderTopRightRadius: `${value}` },
        [nameClass('rounded-br', modifier)]: { borderBottomRightRadius: `${value}` },
        [nameClass('rounded-bl', modifier)]: { borderBottomLeftRadius: `${value}` },
      }),
    ]

    const utilities = _.flatMap(generators, (generator) => {
      return _.flatMap(theme('borderRadius'), (value, modifier) => {
        return generator(value, modifier)
      })
    })

    addUtilities(utilities, variants('borderRadius'))
  }
}
