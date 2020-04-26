import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import withAlphaVariable from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, config }) {
    if (config('target') === 'ie11') {
      const utilities = _.fromPairs(
        _.map(flattenColorPalette(theme('backgroundColor')), (value, modifier) => {
          return [`.${e(`bg-${modifier}`)}`, { 'background-color': value }]
        })
      )

      addUtilities(utilities, variants('backgroundColor'))

      return
    }

    const utilities = _.fromPairs(
      _.map(flattenColorPalette(theme('backgroundColor')), (value, modifier) => {
        return [
          `.${e(`bg-${modifier}`)}`,
          withAlphaVariable({
            color: value,
            property: 'background-color',
            variable: '--bg-opacity',
          }),
        ]
      })
    )

    addUtilities(utilities, variants('backgroundColor'))
  }
}
