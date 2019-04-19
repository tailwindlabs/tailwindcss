import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('backgroundSize'), (value, modifier) => [
      `.${e(`bg-${modifier}`)}`,
      {
        'background-size': value,
      },
    ])
  )

  addUtilities(utilities, variants('backgroundSize'))
}
