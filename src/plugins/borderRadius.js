import _ from 'lodash'

export default function({ values, variants }) {
  return function({ addUtilities, e }) {
    const generators = [
      (value, modifier) => ({
        [`.${e(`radius-${modifier}`)}`]: { borderRadius: `${value}` },
      }),
      (value, modifier) => ({
        [`.${e(`radius-t-${modifier}`)}`]: {
          borderTopLeftRadius: `${value}`,
          borderTopRightRadius: `${value}`,
        },
        [`.${e(`radius-r-${modifier}`)}`]: {
          borderTopRightRadius: `${value}`,
          borderBottomRightRadius: `${value}`,
        },
        [`.${e(`radius-b-${modifier}`)}`]: {
          borderBottomRightRadius: `${value}`,
          borderBottomLeftRadius: `${value}`,
        },
        [`.${e(`radius-l-${modifier}`)}`]: {
          borderTopLeftRadius: `${value}`,
          borderBottomLeftRadius: `${value}`,
        },
      }),
      (value, modifier) => ({
        [`.${e(`radius-tl-${modifier}`)}`]: { borderTopLeftRadius: `${value}` },
        [`.${e(`radius-tr-${modifier}`)}`]: { borderTopRightRadius: `${value}` },
        [`.${e(`radius-br-${modifier}`)}`]: { borderBottomRightRadius: `${value}` },
        [`.${e(`radius-bl-${modifier}`)}`]: { borderBottomLeftRadius: `${value}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(values, generator)
    })

    addUtilities(utilities, variants)
  }
}
