import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (value, modifier) => ({
        [`.${e(`divide-y${modifier}`)} > * + *`]: { 'border-top-width': `${value}` },
        [`.${e(`divide-x${modifier}`)} > * + *`]: { 'border-left-width': `${value}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('divideWidth'), (value, modifier) => {
        return generator(value, modifier === 'default' ? '' : `-${modifier}`)
      })
    })

    addUtilities(utilities, variants('divideWidth'))
  }
}
