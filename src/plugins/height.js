import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('height'), (value, modifier) => [
      `.${e(`h-${modifier}`)}`,
      {
        height: value,
      },
    ])
  )

  addUtilities(utilities, variants('height'))
}
