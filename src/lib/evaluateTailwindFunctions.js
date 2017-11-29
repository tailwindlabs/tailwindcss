import _ from 'lodash'
import functions from 'postcss-functions'

export default function(config) {
  return functions({
    functions: {
      config: (path, defaultValue) => {
        return _.get(config(), _.trim(path, `'"`), defaultValue)
      },
    },
  })
}
