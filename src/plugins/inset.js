import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(`inset-${modifier}`)}`]: {
          top: `${size}`,
          right: `${size}`,
          bottom: `${size}`,
          left: `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(`inset-y-${modifier}`)}`]: { top: `${size}`, bottom: `${size}` },
        [`.${e(`inset-x-${modifier}`)}`]: { right: `${size}`, left: `${size}` },
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
