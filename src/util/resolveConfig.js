import invokeDeep from 'invoke-deep'
import defaults from 'lodash/defaults'
import map from 'lodash/map'

export default function(configs) {
  const config = defaults(
    {
      theme: defaults(...map(configs, 'theme')),
      variants: defaults(...map(configs, 'variants')),
    },
    ...configs
  )

  invokeDeep(config.theme)

  return config
}
