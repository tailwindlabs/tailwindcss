import _ from 'lodash'

function className(prefix, modifier) {
  return _.startsWith(modifier, '-') ? `-${prefix}-${modifier.slice(1)}` : `${prefix}-${modifier}`
}

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    const generators = [
      (size, modifier) => ({
        [`.${e(className('m', modifier))}`]: { margin: `${size}` },
      }),
      (size, modifier) => ({
        [`.${e(className('my', modifier))}`]: {
          'margin-top': `${size}`,
          'margin-bottom': `${size}`,
        },
        [`.${e(className('mx', modifier))}`]: {
          'margin-left': `${size}`,
          'margin-right': `${size}`,
        },
      }),
      (size, modifier) => ({
        [`.${e(className('mt', modifier))}`]: { 'margin-top': `${size}` },
        [`.${e(className('mr', modifier))}`]: { 'margin-right': `${size}` },
        [`.${e(className('mb', modifier))}`]: { 'margin-bottom': `${size}` },
        [`.${e(className('ml', modifier))}`]: { 'margin-left': `${size}` },
      }),
    ]

    const utilities = _.flatMap(generators, generator => {
      return _.flatMap(theme('margin'), generator)
    })

    addUtilities(utilities, variants('margin'))
  }
}
