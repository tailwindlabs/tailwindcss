import _ from 'lodash'
import functions from 'postcss-functions'

export default function(config) {
  return functions({
    functions: {
      theme: (path, ...defaultValue) => {
        return _.get(config.theme, _.trim(path, `'"`), defaultValue.join(', '))
      },
    },
  })
}
