import _ from 'lodash'
import functions from 'postcss-functions'

export default function(config) {
  return functions({
    functions: {
      config: (path, defaultValue) => {
        const options = config()
        return _.get(options, _.trim(path, `'"`), defaultValue)
      },
    },
  })
}
