import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'
import nameClass from '../util/nameClass'
import toColorValue from '../util/toColorValue'
import { toRgba } from '../util/withAlphaVariable'

export default function () {
  return function ({ addUtilities, theme, variants }) {
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
            nameClass('from', modifier),
            {
              '--tw-gradient-from-color': toColorValue(value, 'from'),
              '--tw-gradient-color-stops': `var(--tw-gradient-from-color), var(--tw-gradient-to-color, ${transparentTo})`,
            },
          ],
          [
            nameClass('via', modifier),
            {
              '--tw-gradient-color-stops': `var(--tw-gradient-from-color), ${toColorValue(
                value,
                'via'
              )}, var(--tw-gradient-to-color, ${transparentTo})`,
            },
          ],
          [
            nameClass('to', modifier),
            {
              '--tw-gradient-to-color': toColorValue(value, 'to'),
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
