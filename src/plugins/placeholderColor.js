import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants, corePlugins }) {
    const colors = flattenColorPalette(theme('placeholderColor'))

    const getProperties = (value) => {
      if (corePlugins('placeholderOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'color',
          variable: '--tw-placeholder-opacity',
        })
      }

      return { color: toColorValue(value) }
    }

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [`${nameClass('placeholder', modifier)}::placeholder`, getProperties(value)]
      })
    )

    addUtilities(utilities, variants('placeholderColor'))
  }
}
