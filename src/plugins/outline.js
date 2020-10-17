import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    const utilities = _.fromPairs(
      _.map(theme('outline'), (value, modifier) => {
        const [outline, outlineOffset = '0'] = Array.isArray(value) ? value : [value]

        return [
          nameClass('outline', modifier),
          {
            outline,
            outlineOffset,
          },
        ]
      })
    )

    addUtilities(utilities, variants('outline'))
  }
}
