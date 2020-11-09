import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import { toRgba } from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const colors = flattenColorPalette(theme('ringColor'))
    const utilities = _.fromPairs(
      _.map(_.omit(colors, 'DEFAULT'), (value, modifier) => {
        try {
          const [r, g, b, a] = toRgba(value)
          return [
            nameClass('ring', modifier),
            {
              '--ring-opacity': a === undefined ? '1' : a,
              '--ring-color': `rgba(${r}, ${g}, ${b}, var(--ring-opacity))`,
            },
          ]
        } catch (_error) {
          return [
            nameClass('ring', modifier),
            {
              '--ring-color': value,
            },
          ]
        }
      })
    )
    addUtilities(utilities, variants('ringColor'))
  }
}
