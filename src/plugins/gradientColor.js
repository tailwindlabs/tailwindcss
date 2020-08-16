import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, theme, variants, target }) {
    if (target('gradientColor') === 'ie11') {
      return
    }

    const colors = flattenColorPalette(theme('gradientColor'))

    const utilities = _(colors)
      .map((value, modifier) => {
        return [
          [
            `.${e(`gradient-from-${modifier}`)}`,
            {
              '--gradient-from-color': value,
              '--gradient-color-stops': 'var(--gradient-from-color)',
            },
          ],
          [
            `.${e(`gradient-to-${modifier}`)}`,
            {
              '--gradient-to-color': value,
              '--gradient-color-stops': 'var(--gradient-from-color), var(--gradient-to-color)',
            },
          ],
          [
            `.${e(`gradient-mid-${modifier}`)}`,
            {
              '--gradient-mid-color': value,
              '--gradient-color-stops':
                'var(--gradient-from-color), var(--gradient-mid-color), var(--gradient-to-color)',
            },
          ],
        ]
      })
      .unzip()
      .flatten()
      .fromPairs()
      .value()

    addUtilities(utilities, variants('gradientColor'))
  }
}
