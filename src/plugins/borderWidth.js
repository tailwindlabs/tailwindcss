import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (value, modifier) => ({
        [`.${e(`border${modifier}`)}`]: { borderWidth: `${value}` },
      }),
      (size, modifier) => ({
        [`.${e(`border-y${modifier}`)}`]: {
          borderTopWidth: `${size}`,
          borderBottomWidth: `${size}`,
        },
        [`.${e(`border-x${modifier}`)}`]: {
          borderLeftWidth: `${size}`,
          borderRightWidth: `${size}`,
        },
      }),
      (value, modifier) => ({
        [`.${e(`border-t${modifier}`)}`]: { borderTopWidth: `${value}` },
        [`.${e(`border-r${modifier}`)}`]: { borderRightWidth: `${value}` },
        [`.${e(`border-b${modifier}`)}`]: { borderBottomWidth: `${value}` },
        [`.${e(`border-l${modifier}`)}`]: { borderLeftWidth: `${value}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('borderWidth'), (value, modifier) => {
        return generator(value, modifier === 'default' ? '' : `-${modifier}`)
      })
    })

    addUtilities(utilities, variants('borderWidth'))
  }
}
