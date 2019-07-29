import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config, variants }) {
    const utilities = _.fromPairs(
      _.map(config('theme.lineHeight'), (value, modifier) => {
        return [
          `.${e(`leading-${modifier}`)}`,
          {
            'line-height': value,
          },
        ]
      })
    )

    addUtilities(utilities, variants('lineHeight'))
  }
}
