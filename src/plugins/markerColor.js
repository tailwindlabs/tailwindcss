import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target, corePlugins }) {
    const colors = flattenColorPalette(theme('markerColor'))

    const getProperties = value => {
      if (target('markerColor') === 'ie11') {
        return { color: value }
      }

      if (corePlugins('markerOpacity')) {
        return withAlphaVariable({
          color: value,
          property: 'color',
          variable: '--marker-opacity'
        })
      }

      return { color: value }
    }

    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'default'), (value, modifier) => {
        return [`.${e(`marker-${modifier}`)} > :not(template)::before`, getProperties(value)]
      })
    )

    addUtilities(utilities, variants('markerColor'))
  }
}
