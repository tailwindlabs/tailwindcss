import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const flexShrink = config('classesNames').flexShrink

    addUtilities(
      _.fromPairs(
        _.map(config('theme.flexShrink'), (value, modifier) => {
          const className =
            modifier === 'default' ? flexShrink.replace(/-$/g, '') : `${flexShrink}-${modifier}`
          return [
            `.${e(className)}`,
            {
              'flex-shrink': value,
            },
          ]
        })
      ),
      config('variants.flexShrink')
    )
  }
}
