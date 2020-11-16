import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import withAlphaVariable from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const colors = flattenColorPalette(theme('ringColor'))

    const getProperties = (value) => {
      return withAlphaVariable({
        color: value,
        property: '--tw-ring-color',
        variable: '--tw-ring-opacity',
      })
    }

    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'DEFAULT'), (value, modifier) => {
        return [nameClass('ring', modifier), getProperties(value)]
      })
    )

    addUtilities(utilities, variants('ringColor'))
  }
}
