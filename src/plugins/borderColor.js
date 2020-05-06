import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target, corePlugins }) {
    const colors = flattenColorPalette(theme('borderColor'))

    if (target('borderColor') === 'ie11') {
      const utilities = _.fromPairs(
        _.map(_.omit(colors, 'default'), (value, modifier) => {
          return [`.${e(`border-${modifier}`)}`, { 'border-color': value }]
        })
      )

      addUtilities(utilities, variants('borderColor'))

      return
    }

    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'default'), (value, modifier) => {
        return [
          `.${e(`border-${modifier}`)}`,
          corePlugins('borderOpacity')
            ? withAlphaVariable({
                color: value,
                property: 'border-color',
                variable: '--border-opacity',
              })
            : { 'border-color': value },
        ]
      })
    )

    addUtilities(utilities, variants('borderColor'))
  }
}
