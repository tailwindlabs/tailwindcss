import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  addUtilities(
    _.fromPairs(
      _.map(theme('flexGrow'), (value, modifier) => {
        const className = modifier === 'default' ? 'flex-grow' : `flex-grow-${modifier}`

        return [
          `.${e(className)}`,
          {
            'flex-grow': value,
          },
        ]
      })
    ),
    variants('flexGrow')
  )
}
