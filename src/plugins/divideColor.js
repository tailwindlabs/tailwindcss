import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target, corePlugins }) {
    const colors = flattenColorPalette(theme('divideColor'))

    const getProperties = value => {
      if (target('divideColor') === 'ie11') {
        return { 'border-color': value }
      }

      if (corePlugins('divideOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'border-color',
          variable: '--divide-opacity',
        })
      }

      return { 'border-color': value }
    }

    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'default'), (value, modifier) => {
        return [
          `.${e(`divide-${modifier}`)} > :not(template) ~ :not(template)`,
          getProperties(value),
        ]
      })
    )

    addUtilities(utilities, variants('divideColor'))
  }
}
