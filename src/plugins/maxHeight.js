import _ from 'lodash'

export default function() {
  return function({ addUtilities, config, e }) {
    const utilities = _.fromPairs(
      _.map(config('theme.maxHeight'), (value, modifier) => {
        return [
          `.${e(`${config('classesNames').maxHeight}-${modifier}`)}`,
          {
            'max-height': value,
          },
        ]
      })
    )

    addUtilities(utilities, config('variants.maxHeight'))
  }
}
