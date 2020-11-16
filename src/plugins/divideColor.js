import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants, corePlugins }) {
    const colors = flattenColorPalette(theme('divideColor'))

    const getProperties = (value) => {
      if (corePlugins('divideOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'border-color',
          variable: '--tw-divide-opacity',
        })
      }

      return { 'border-color': toColorValue(value) }
    }

    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'DEFAULT'), (value, modifier) => {
        return [
          `${nameClass('divide', modifier)} > :not([hidden]) ~ :not([hidden])`,
          getProperties(value),
        ]
      })
    )

    addUtilities(utilities, variants('divideColor'))
  }
}
