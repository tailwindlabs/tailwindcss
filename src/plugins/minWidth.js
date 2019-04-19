import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('minWidth'), (value, modifier) => [
      `.${e(`min-w-${modifier}`)}`,
      {
        'min-width': value,
      },
    ])
  )

  addUtilities(utilities, variants('minWidth'))
}
