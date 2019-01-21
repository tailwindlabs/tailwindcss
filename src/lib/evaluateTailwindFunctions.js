import _ from 'lodash'
import functions from 'postcss-functions'

export default function(config, pluginConfigValues) {
  return functions({
    functions: {
      config: (path, defaultValue) => {
        const trimmedPath = _.trim(path, `'"`)
        return _.get(config, trimmedPath, _.get(pluginConfigValues, trimmedPath, defaultValue))
      },
    },
  })
}
