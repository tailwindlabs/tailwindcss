import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (value, modifier) => ({
        [`.${e(`rounded${modifier}`)}`]: { borderRadius: `${value}` },
      }),
      (value, modifier) => ({
        [`.${e(`rounded-t${modifier}`)}`]: {
          borderTopLeftRadius: `${value}`,
          borderTopRightRadius: `${value}`,
        },
        [`.${e(`rounded-r${modifier}`)}`]: {
          borderTopRightRadius: `${value}`,
          borderBottomRightRadius: `${value}`,
        },
        [`.${e(`rounded-b${modifier}`)}`]: {
          borderBottomRightRadius: `${value}`,
          borderBottomLeftRadius: `${value}`,
        },
        [`.${e(`rounded-l${modifier}`)}`]: {
          borderTopLeftRadius: `${value}`,
          borderBottomLeftRadius: `${value}`,
        },
      }),
      (value, modifier) => ({
        [`.${e(`rounded-tl${modifier}`)}`]: { borderTopLeftRadius: `${value}` },
        [`.${e(`rounded-tr${modifier}`)}`]: { borderTopRightRadius: `${value}` },
        [`.${e(`rounded-br${modifier}`)}`]: { borderBottomRightRadius: `${value}` },
        [`.${e(`rounded-bl${modifier}`)}`]: { borderBottomLeftRadius: `${value}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('borderRadius'), (value, modifier) => {
        return generator(value, modifier === 'default' ? '' : `-${modifier}`)
      })
    })

    addUtilities(utilities, variants('borderRadius'))
  }
}
