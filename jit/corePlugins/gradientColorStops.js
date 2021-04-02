const flattenColorPalette = require('../../lib/util/flattenColorPalette').default
const toColorValue = require('../../lib/util/toColorValue').default
const toRgba = require('../../lib/util/withAlphaVariable').toRgba
const { asColor, nameClass } = require('../pluginUtils')

function transparentTo(value) {
  if (typeof value === 'function') {
    return value({ opacityValue: 0 })
  }

  try {
    const [r, g, b] = toRgba(value)
    return `rgba(${r}, ${g}, ${b}, 0)`
  } catch (_error) {
    return `rgba(255, 255, 255, 0)`
  }
}

module.exports = function ({ matchUtilities, theme }) {
  let colorPalette = flattenColorPalette(theme('gradientColorStops'))

  matchUtilities({
    from: (modifier) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      let transparentToValue = transparentTo(value)

      return {
        [nameClass('from', modifier)]: {
          '--tw-gradient-from': toColorValue(value, 'from'),
          '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to, ${transparentToValue})`,
        },
      }
    },
  })
  matchUtilities({
    via: (modifier) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      let transparentToValue = transparentTo(value)

      return {
        [nameClass('via', modifier)]: {
          '--tw-gradient-stops': `var(--tw-gradient-from), ${toColorValue(
            value,
            'via'
          )}, var(--tw-gradient-to, ${transparentToValue})`,
        },
      }
    },
  })
  matchUtilities({
    to: (modifier) => {
      let value = asColor(modifier, colorPalette)

      if (value === undefined) {
        return []
      }

      return {
        [nameClass('to', modifier)]: {
          '--tw-gradient-to': toColorValue(value, 'to'),
        },
      }
    },
  })
}
