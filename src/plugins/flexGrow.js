import _ from 'lodash'

export default function() {
  return function({ addUtilities, e, config }) {
    const flexGrow = config('classesNames').flexGrow

    addUtilities(
      _.fromPairs(
        _.map(config('theme.flexGrow'), (value, modifier) => {
          const className =
            modifier === 'default' ? flexGrow.replace(/-$/g, '') : `${flexGrow}-${modifier}`
          return [
            `.${e(className)}`,
            {
              'flex-grow': value,
            },
          ]
        })
      ),
      config('variants.flexGrow')
    )
  }
}
