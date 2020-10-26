import defaultConfig from '../../stubs/defaultConfig.stub.js'
import { flagEnabled } from '../featureFlags'
import { flatMap, get, isFunction } from 'lodash'

export default function getAllConfigs(config) {
  const configs = flatMap([...get(config, 'presets', [defaultConfig])].reverse(), (preset) => {
    return getAllConfigs(isFunction(preset) ? preset() : preset)
  })

  const features = {
    // Add experimental configs here...
  }

  Object.keys(features).forEach((feature) => {
    if (flagEnabled(config, feature)) {
      configs.unshift(features[feature])
    }
  })

  return [config, ...configs]
}
