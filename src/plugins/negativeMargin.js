import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const classesNames = config('classesNames')
    const negativeMargin = classesNames.negativeMargin

    const generators = [
      (size, modifier) => ({
        [`.${e(`${negativeMargin.replace(/-$/g, '')}-${modifier}`)}`]: {
          margin: `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(`${negativeMargin}${config('sides').vertical}-${modifier}`)}`]: {
          'margin-top': `${size}`,
          'margin-bottom': `${size}`,
        },
        [`.${e(`${negativeMargin}${config('sides').horizontal}-${modifier}`)}`]: {
          'margin-left': `${size}`,
          'margin-right': `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(`${negativeMargin}${config('sides').top}-${modifier}`)}`]: {
          'margin-top': `${size}`,
        },
        [`.${e(`${negativeMargin}${config('sides').right}-${modifier}`)}`]: {
          'margin-right': `${size}`,
        },
        [`.${e(`${negativeMargin}${config('sides').bottom}-${modifier}`)}`]: {
          'margin-bottom': `${size}`,
        },
        [`.${e(`${negativeMargin}${config('sides').left}-${modifier}`)}`]: {
          'margin-left': `${size}`,
        },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(config('theme.negativeMargin'), (size, modifier) => {
        return generator(`${size}` === '0' ? `${size}` : `-${size}`, modifier)
      })
    })

    addUtilities(utilities, config('variants.negativeMargin'))
  }
}
