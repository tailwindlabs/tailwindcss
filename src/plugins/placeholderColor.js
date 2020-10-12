import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target, corePlugins }) {
    const colors = flattenColorPalette(theme('placeholderColor'))

    const getProperties = value => {
      if (target('placeholderColor') === 'ie11') {
        return { color: toColorValue(value) }
      }

      if (corePlugins('placeholderOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'color',
          variable: '--placeholder-opacity',
        })
      }

      return { color: toColorValue(value) }
    }

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [`.${e(`placeholder-${modifier}`)}::placeholder`, getProperties(value)]
      })
    )

    addUtilities(utilities, variants('placeholderColor'))
  }
}
