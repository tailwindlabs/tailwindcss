import _ from 'lodash'
import functions from 'postcss-functions'

export default config =>
  functions({
    functions: {
      theme: (path, ...defaultValue) =>
        _.thru(_.get(config.theme, _.trim(path, `'"`), defaultValue), value =>
          _.isArray(value) ? value.join(', ') : value
        ),
    },
  })
