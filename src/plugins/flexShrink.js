import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    addUtilities(
      _.fromPairs(
        _.map(config('theme.flexShrink'), (value, modifier) => {
          const className = modifier === 'default' ? 'flex-shrink' : `flex-shrink-${modifier}`
          return [
            `.${e(className)}`,
            {
              'flex-shrink': value,
            },
          ]
        })
      ),
      config('variants.flexShrink')
    )
  }
}
