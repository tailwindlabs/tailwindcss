import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const padding = config('classesNames').padding

    const generators = [
      (size, modifier) => ({
        [`.${e(`${padding.replace(/-$/g, '')}-${modifier}`)}`]: { padding: `${size}` },
      }),
      (size, modifier) => ({
        [`.${e(`${padding}${config('sides').vertical}-${modifier}`)}`]: {
          'padding-top': `${size}`,
          'padding-bottom': `${size}`,
        },
        [`.${e(`${padding}${config('sides').horizontal}-${modifier}`)}`]: {
          'padding-left': `${size}`,
          'padding-right': `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(`${padding}${config('sides').top}-${modifier}`)}`]: {
          'padding-top': `${size}`,
        },
        [`.${e(`${padding}${config('sides').right}-${modifier}`)}`]: {
          'padding-right': `${size}`,
        },
        [`.${e(`${padding}${config('sides').bottom}-${modifier}`)}`]: {
          'padding-bottom': `${size}`,
        },
        [`.${e(`${padding}${config('sides').left}-${modifier}`)}`]: {
          'padding-left': `${size}`,
        },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(config('theme.padding'), generator)
    })

    addUtilities(utilities, config('variants.padding'))
  }
}
