import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.minHeight'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').minHeight}-${modifier}`)}`,
          {
            'min-height': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.minHeight'))
  }
}
