import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target, corePlugins }) {
    const colors = flattenColorPalette(theme('divideColor'))

    if (target('divideColor') === 'ie11') {
      const utilities = _.fromPairs(
        _.map(_.omit(colors, 'default'), (value, modifier) => {
          return [
            `.${e(`divide-${modifier}`)} > :not(template) ~ :not(template)`,
            { 'border-color': value },
          ]
        })
      )

      addUtilities(utilities, variants('textColor'))

      return
    }

    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'default'), (value, modifier) => {
        return [
          `.${e(`divide-${modifier}`)} > :not(template) ~ :not(template)`,
          corePlugins('divideOpacity')
            ? withAlphaVariable({
                color: value,
                property: 'border-color',
                variable: '--divide-opacity',
              })
            : { 'border-color': value },
        ]
      })
    )

    addUtilities(utilities, variants('divideColor'))
  }
}
