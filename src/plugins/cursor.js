import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('cursor'), (value, modifier) => [
      `.${e(`cursor-${modifier}`)}`,
      {
        cursor: value,
      },
    ])
  )

  addUtilities(utilities, variants('cursor'))
}
