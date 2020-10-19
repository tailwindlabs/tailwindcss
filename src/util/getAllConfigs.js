import defaultConfig from '../../stubs/defaultConfig.stub.js'
import { flagEnabled } from '../featureFlags'
import { flatMap, get } from 'lodash'

export default function getAllConfigs(config, defaultPresets = [defaultConfig]) {
  const configs = flatMap([...get(config, 'presets', defaultPresets)].reverse(), (preset) => {
    return getAllConfigs(preset, [])
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
