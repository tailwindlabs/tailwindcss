import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('opacity'), (value, modifier) => [
      `.${e(`opacity-${modifier}`)}`,
      {
        opacity: value,
      },
    ])
  )

  addUtilities(utilities, variants('opacity'))
}
