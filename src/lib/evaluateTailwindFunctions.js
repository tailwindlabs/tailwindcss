import _ from 'lodash'
import functions from 'postcss-functions'

export default function(config) {
  return functions({
    functions: {
      theme: (path, ...defaultValue) => {
        return _.thru(_.get(config.theme, _.trim(path, `'"`), defaultValue), value => {
          return _.isArray(value) ? value.join(', ') : value
        })
      },
    },
  })
}
