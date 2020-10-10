import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import toColorValue from '../util/toColorValue'
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
          if (_.isFunction(value)) {
            return value({ opacityValue: 0 })
          }

          try {
            const [r, g, b] = toRgba(value)
            return `rgba(${r}, ${g}, ${b}, 0)`
          } catch (_error) {
            return `rgba(255, 255, 255, 0)`
          }
        })()

        return [
          [
            `.${e(`from-${modifier}`)}`,
            {
              '--gradient-from-color': toColorValue(value, 'from'),
              '--gradient-color-stops': `var(--gradient-from-color), var(--gradient-to-color, ${transparentTo})`,
            },
          ],
          [
            `.${e(`via-${modifier}`)}`,
            {
              '--gradient-via-color': toColorValue(value, 'via'),
              '--gradient-color-stops': `var(--gradient-from-color), var(--gradient-via-color), var(--gradient-to-color, ${transparentTo})`,
            },
          ],
          [
            `.${e(`to-${modifier}`)}`,
            {
              '--gradient-to-color': toColorValue(value, 'to'),
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
