import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(`p-${modifier}`)}`]: { padding: `${size}` },
      }),
      (size, modifier) => ({
        [`.${e(`py-${modifier}`)}`]: { 'padding-top': `${size}`, 'padding-bottom': `${size}` },
        [`.${e(`px-${modifier}`)}`]: { 'padding-left': `${size}`, 'padding-right': `${size}` },
      }),
      (size, modifier) => ({
        [`.${e(`pt-${modifier}`)}`]: { 'padding-top': `${size}` },
        [`.${e(`pr-${modifier}`)}`]: { 'padding-right': `${size}` },
        [`.${e(`pb-${modifier}`)}`]: { 'padding-bottom': `${size}` },
        [`.${e(`pl-${modifier}`)}`]: { 'padding-left': `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('padding'), generator)
    })

    addUtilities(utilities, variants('padding'))
  }
}
