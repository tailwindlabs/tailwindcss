import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  addUtilities(
    _.fromPairs(
      _.map(theme('flexShrink'), (value, modifier) => {
        const className = modifier === 'default' ? 'flex-shrink' : `flex-shrink-${modifier}`

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
