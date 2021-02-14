import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants, corePlugins }) {
    const colors = flattenColorPalette(theme('caretColor'))

    const getProperties = (value) => {
      if (corePlugins('caretOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'color',
          variable: '--tw-caret-opacity',
        })
      }

      return { 'caret-color': toColorValue(value) }
    }

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [nameClass('caret', modifier), getProperties(value)]
      })
    )

    addUtilities(utilities, variants('caretColor'))
  }
}
