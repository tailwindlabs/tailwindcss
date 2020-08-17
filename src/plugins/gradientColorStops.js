import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import { toRgba } from '../util/withAlphaVariable'

export default function() {
  return function({ addUtilities, e, theme, variants, target }) {
    if (target('gradientColorStops') === 'ie11') {
      return
    }

    const colors = flattenColorPalette(theme('gradientColorStops'))

    const utilities = _(colors)
      .map((value, modifier) => {
        const transparentTo = (() => {
          try {
            const [r, g, b] = toRgba(value)
            return `rgba(${r}, ${g}, ${b}, 0)`
          } catch {
            return `rgba(255, 255, 255, 0)`
          }
        })()

        return [
          [
            `.${e(`from-${modifier}`)}`,
            {
              '--gradient-from-color': value,
              '--gradient-color-stops': `var(--gradient-from-color), var(--gradient-to-color, ${transparentTo})`,
            },
          ],
          [
            `.${e(`via-${modifier}`)}`,
            {
              '--gradient-via-color': value,
              '--gradient-color-stops': `var(--gradient-from-color), var(--gradient-via-color), var(--gradient-to-color, ${transparentTo})`,
            },
          ],
          [
            `.${e(`to-${modifier}`)}`,
            {
              '--gradient-to-color': value,
            },
          ],
        ]
      })
      .unzip()
      .flatten()
      .fromPairs()
      .value()

    addUtilities(utilities, variants('gradientColorStops'))
  }
}
