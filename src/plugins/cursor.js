import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config, variants }) {
    const utilities = _.fromPairs(
      _.map(config('theme.cursor'), (value, modifier) => {
        return [
          `.${e(`cursor-${modifier}`)}`,
          {
            cursor: value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('cursor'))
  }
}
