import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('letterSpacing'), (value, modifier) => [
      `.${e(`tracking-${modifier}`)}`,
      {
        'letter-spacing': value,
      },
    ])
  )

  addUtilities(utilities, variants('letterSpacing'))
}
