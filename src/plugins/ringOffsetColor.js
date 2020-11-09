import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const colors = flattenColorPalette(theme('ringOffsetColor'))
    const utilities = _.fromPairs(
      _.map(colors, (value, modifier) => {
        return [
          nameClass('ring-offset', modifier),
          {
            '--ring-offset-color': value,
          },
        ]
      })
    )
    addUtilities(utilities, variants('ringOffsetColor'))
  }
}
