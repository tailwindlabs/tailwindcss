import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const borderRadius = config('classesNames').borderRadius

    const generators = [
      (value, modifier) => ({
        [`.${e(`${borderRadius}${modifier}`)}`]: {
          borderRadius: `${value}`,
        },
      }),
      (value, modifier) => ({
        [`.${e(`${borderRadius}-${config('sides').top}${modifier}`)}`]: {
          borderTopLeftRadius: `${value}`,
          borderTopRightRadius: `${value}`,
        },
        [`.${e(`${borderRadius}-${config('sides').right}${modifier}`)}`]: {
          borderTopRightRadius: `${value}`,
          borderBottomRightRadius: `${value}`,
        },
        [`.${e(`${borderRadius}-${config('sides').bottom}${modifier}`)}`]: {
          borderBottomRightRadius: `${value}`,
          borderBottomLeftRadius: `${value}`,
        },
        [`.${e(`${borderRadius}-${config('sides').left}${modifier}`)}`]: {
          borderTopLeftRadius: `${value}`,
          borderBottomLeftRadius: `${value}`,
        },
      }),
      (value, modifier) => ({
        [`.${e(`${borderRadius}-tl${modifier}`)}`]: {
          borderTopLeftRadius: `${value}`,
        },
        [`.${e(`${borderRadius}-tr${modifier}`)}`]: {
          borderTopRightRadius: `${value}`,
        },
        [`.${e(`${borderRadius}-br${modifier}`)}`]: {
          borderBottomRightRadius: `${value}`,
        },
        [`.${e(`${borderRadius}-bl${modifier}`)}`]: {
          borderBottomLeftRadius: `${value}`,
        },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(config('theme.borderRadius'), (value, modifier) => {
        return generator(value, modifier === 'default' ? '' : `-${modifier}`)
      })
    })

    addUtilities(utilities, config('variants.borderRadius'))
  }
}
