import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('fontWeight'), (value, modifier) => [
      `.${e(`font-${modifier}`)}`,
      {
        'font-weight': value,
      },
    ])
  )

  addUtilities(utilities, variants('fontWeight'))
}
