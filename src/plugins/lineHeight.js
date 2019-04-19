import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('lineHeight'), (value, modifier) => [
      `.${e(`leading-${modifier}`)}`,
      {
        'line-height': value,
      },
    ])
  )

  addUtilities(utilities, variants('lineHeight'))
}
