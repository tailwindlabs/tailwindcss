import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('flex'), (value, modifier) => [
      `.${e(`flex-${modifier}`)}`,
      {
        flex: value,
      },
    ])
  )

  addUtilities(utilities, variants('flex'))
}
