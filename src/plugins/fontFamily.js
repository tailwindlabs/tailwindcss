import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('fontFamily'), (value, modifier) => [
      `.${e(`font-${modifier}`)}`,
      {
        'font-family': _.isArray(value) ? value.join(', ') : value,
      },
    ])
  )

  addUtilities(utilities, variants('fontFamily'))
}
