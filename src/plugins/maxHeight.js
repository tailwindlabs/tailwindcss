import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('maxHeight'), (value, modifier) => [
      `.${e(`max-h-${modifier}`)}`,
      {
        'max-height': value,
      },
    ])
  )

  addUtilities(utilities, variants('maxHeight'))
}
