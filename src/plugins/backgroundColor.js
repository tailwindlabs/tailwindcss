import _ from 'lodash'
import flattenColorPalette from '../util/flattenColorPalette'

export default function() {
  return function({ addUtilities, e, config }) {
    const utilities = _.fromPairs(
      _.map(flattenColorPalette(config('theme.backgroundColor')), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').backgroundColor}-${modifier}`)}`,
          {
            'background-color': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.backgroundColor'))
  }
}
