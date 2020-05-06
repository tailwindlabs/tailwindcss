import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target, corePlugins }) {
    const colors = flattenColorPalette(theme('placeholderColor'))

    if (target('placeholderColor') === 'ie11') {
      const utilities = _.fromPairs(
        _.map(colors, (value, modifier) => {
          return [
            `.${e(`placeholder-${modifier}`)}::placeholder`,
            { color: value },
          ]
        })
      )

      addUtilities(utilities, variants('placeholderColor'))

      return
    }

    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [
          `.${e(`placeholder-${modifier}`)}::placeholder`,
          corePlugins('placeholderOpacity')
            ? withAlphaVariable({
                color: value,
                property: 'color',
                variable: '--placeholder-opacity',
              })
            : { color: value },
        ]
      })
    )

    addUtilities(utilities, variants('placeholderColor'))
  }
}
