import _ from 'lodash'

export default () => ({ addUtilities, e, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('fontSize'), (value, modifier) => [
      `.${e(`text-${modifier}`)}`,
      {
        'font-size': value,
      },
    ])
  )

  addUtilities(utilities, variants('fontSize'))
}
