import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants, corePlugins }) {
    const colors = flattenColorPalette(theme('textColor'))

    const getProperties = (value) => {
      if (corePlugins('textOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'color',
          variable: '--tw-text-opacity',
        })
      }

      return { color: toColorValue(value) }
    }

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [nameClass('text', modifier), getProperties(value)]
      })
    )

    addUtilities(utilities, variants('textColor'))
  }
}
