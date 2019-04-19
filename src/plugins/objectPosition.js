import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('objectPosition'), (value, modifier) => [
      `.${e(`object-${modifier}`)}`,
      {
        'object-position': value,
      },
    ])
  )

  addUtilities(utilities, variants('objectPosition'))
}
