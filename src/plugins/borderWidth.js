import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const borderWidth = config('classesNames').borderWidth

    const generators = [
      (value, modifier) => ({
        [`.${e(`${borderWidth.replace(/-$/g, '')}${modifier}`)}`]: {
          borderWidth: `${value}`,
        },
      }),
      (value, modifier) => ({
        [`.${e(`${borderWidth}-${config('sides').top}${modifier}`)}`]: {
          borderTopWidth: `${value}`,
        },
        [`.${e(`${borderWidth}-${config('sides').right}${modifier}`)}`]: {
          borderRightWidth: `${value}`,
        },
        [`.${e(`${borderWidth}-${config('sides').bottom}${modifier}`)}`]: {
          borderBottomWidth: `${value}`,
        },
        [`.${e(`${borderWidth}-${config('sides').left}${modifier}`)}`]: {
          borderLeftWidth: `${value}`,
        },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(config('theme.borderWidth'), (value, modifier) => {
        return generator(value, modifier === 'default' ? '' : `-${modifier}`)
      })
    })

    addUtilities(utilities, config('variants.borderWidth'))
  }
}
