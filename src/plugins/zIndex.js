import _ from 'lodash'

export default () => ({ addUtilities, theme, variants }) => {
  const utilities = _.fromPairs(
    _.map(theme('zIndex'), (value, modifier) => [
      `.z-${modifier}`,
      {
        'z-index': value,
      },
    ])
  )

  addUtilities(utilities, variants('zIndex'))
}
