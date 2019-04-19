import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('maxWidth'), (value, modifier) => [
      `.${e(`max-w-${modifier}`)}`,
      {
        'max-width': value,
      },
    ])
  )

  addUtilities(utilities, variants('maxWidth'))
}
