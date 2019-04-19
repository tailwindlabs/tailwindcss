import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('backgroundPosition'), (value, modifier) => [
      `.${e(`bg-${modifier}`)}`,
      {
        'background-position': value,
      },
    ])
  )

  addUtilities(utilities, variants('backgroundPosition'))
}
