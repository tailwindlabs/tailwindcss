import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const classesNames = config('classesNames')
    const margin = classesNames.margin

    const generators = [
      (size, modifier) => ({
        [`.${e(`${margin.replace(/-$/g, '')}-${modifier}`)}`]: { margin: `${size}` },
      }),
      (size, modifier) => ({
        [`.${e(`${margin}${config('sides').vertical}-${modifier}`)}`]: {
          'margin-top': `${size}`,
          'margin-bottom': `${size}`,
        },
        [`.${e(`${margin}${config('sides').horizontal}-${modifier}`)}`]: {
          'margin-left': `${size}`,
          'margin-right': `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(`${margin}${config('sides').top}-${modifier}`)}`]: {
          'margin-top': `${size}`,
        },
        [`.${e(`${margin}${config('sides').right}-${modifier}`)}`]: {
          'margin-right': `${size}`,
        },
        [`.${e(`${margin}${config('sides').bottom}-${modifier}`)}`]: {
          'margin-bottom': `${size}`,
        },
        [`.${e(`${margin}${config('sides').left}-${modifier}`)}`]: {
          'margin-left': `${size}`,
        },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(config('theme.margin'), generator)
    })

    addUtilities(utilities, config('variants.margin'))
  }
}
