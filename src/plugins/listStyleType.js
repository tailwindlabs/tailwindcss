import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('listStyleType'), (value, modifier) => [
      `.${e(`list-${modifier}`)}`,
      {
        'list-style-type': value,
      },
    ])
  )

  addUtilities(utilities, variants('listStyleType'))
}
