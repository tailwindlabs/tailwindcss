import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    addUtilities(
      _.fromPairs(
        _.map(theme('flexShrink'), (value, modifier) => {
          return [
            nameClass('flex-shrink', modifier),
            {
              'flex-shrink': value,
            },
          ]
        })
      ),
      variants('flexShrink')
    )
  }
}
