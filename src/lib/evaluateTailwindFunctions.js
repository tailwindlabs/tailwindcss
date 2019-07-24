import _ from 'lodash'
import functions from 'postcss-functions'

export default function(config) {
  return functions({
    functions: {
      theme: (path, ...defaultValue) => {
        return _.thru(_.get(config.theme, _.trim(path, `'"`), defaultValue), value => {
          if (value.hasOwnProperty('default')) {
            return value.default
          }
          return Array.isArray(value) ? value.join(', ') : value
        })
      },
    },
  })
}
