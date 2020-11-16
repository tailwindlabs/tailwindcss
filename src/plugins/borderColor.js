import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants, corePlugins }) {
    const colors = flattenColorPalette(theme('borderColor'))

    const getProperties = (value) => {
      if (corePlugins('borderOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'border-color',
          variable: '--tw-border-opacity',
        })
      }

      return { 'border-color': toColorValue(value) }
    }

    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'DEFAULT'), (value, modifier) => {
        return [nameClass('border', modifier), getProperties(value)]
      })
    )

    addUtilities(utilities, variants('borderColor'))
  }
}
