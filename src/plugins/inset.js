import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const inset = config('classesNames').inset

    const generators = [
      (size, modifier) => ({
        [`.${e(`${inset}-${modifier}`)}`]: {
          top: `${size}`,
          right: `${size}`,
          bottom: `${size}`,
          left: `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(`${inset}-${config('sides').vertical}-${modifier}`)}`]: {
          top: `${size}`,
          bottom: `${size}`,
        },
        [`.${e(`${inset}-${config('sides').horizontal}-${modifier}`)}`]: {
          right: `${size}`,
          left: `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(`top-${modifier}`)}`]: { top: `${size}` },
        [`.${e(`right-${modifier}`)}`]: { right: `${size}` },
        [`.${e(`bottom-${modifier}`)}`]: { bottom: `${size}` },
        [`.${e(`left-${modifier}`)}`]: { left: `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(config('theme.inset'), generator)
    })

    addUtilities(utilities, config('variants.inset'))
  }
}
