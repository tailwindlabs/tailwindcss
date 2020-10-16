import _ from 'lodash'
import nameClass from '../util/nameClass'

export default function () {
  return function ({ addUtilities, theme, variants }) {
    addUtilities(
      _.fromPairs(
        _.map(theme('flexGrow'), (value, modifier) => {
          return [
            nameClass('flex-grow', modifier),
            {
              'flex-grow': value,
            },
          ]
        })
      ),
      variants('flexGrow')
    )
  }
}
