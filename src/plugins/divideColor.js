import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target }) {
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
          withAlphaVariable({
            color: value,
            property: 'border-color',
            variable: '--divide-opacity',
          }),
        ]
      })
    )

    addUtilities(utilities, variants('divideColor'))
  }
}
