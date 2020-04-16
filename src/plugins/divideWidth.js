import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (value, modifier) => ({
        [`.${e(`divide-y${modifier}`)} > :not(:last-child)`]: { 'border-bottom-width': `${value}` },
        [`.${e(`divide-x${modifier}`)} > :not(:last-child)`]: { 'border-right-width': `${value}` },
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
