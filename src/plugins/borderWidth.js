import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const generators = [
    (value, modifier) => ({
      [`.${e(`border${modifier}`)}`]: { borderWidth: `${value}` },
    }),
    (value, modifier) => ({
      [`.${e(`border-t${modifier}`)}`]: { borderTopWidth: `${value}` },
      [`.${e(`border-r${modifier}`)}`]: { borderRightWidth: `${value}` },
      [`.${e(`border-b${modifier}`)}`]: { borderBottomWidth: `${value}` },
      [`.${e(`border-l${modifier}`)}`]: { borderLeftWidth: `${value}` },
    }),
  ]

  const utilities = _.flatMap(generators, generator =>
    _.flatMap(theme('borderWidth'), (value, modifier) =>
      generator(value, modifier === 'default' ? '' : `-${modifier}`)
    )
  )

  addUtilities(utilities, variants('borderWidth'))
}
