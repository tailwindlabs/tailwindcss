import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, theme, variants }) {
    addUtilities(
      _.fromPairs(
        _.map(theme('flexShrink'), (value, modifier) => {
          const className = modifier === 'DEFAULT' ? 'flex-shrink' : `flex-shrink-${modifier}`
          return [
            `.${e(className)}`,
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
