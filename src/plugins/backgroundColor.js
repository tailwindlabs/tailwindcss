import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'
import toColorValue from '../util/toColorValue'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants, corePlugins }) {
    const colors = flattenColorPalette(theme('backgroundColor'))

    const getProperties = (value) => {
      if (corePlugins('backgroundOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'background-color',
          variable: '--tw-bg-opacity',
        })
      }

      return { 'background-color': toColorValue(value) }
    }

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [nameClass('bg', modifier), getProperties(value)]
      })
    )

    addUtilities(utilities, variants('backgroundColor'))
  }
}
