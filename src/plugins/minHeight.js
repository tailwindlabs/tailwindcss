import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('minHeight'), (value, modifier) => [
      `.${e(`min-h-${modifier}`)}`,
      {
        'min-height': value,
      },
    ])
  )

  addUtilities(utilities, variants('minHeight'))
}
