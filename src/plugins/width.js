import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('width'), (value, modifier) => [
      `.${e(`w-${modifier}`)}`,
      {
        width: value,
      },
    ])
  )

  addUtilities(utilities, variants('width'))
}
