import defaultConfig from '../../stubs/defaultConfig.stub.js'
import { flagEnabled } from '../featureFlags'
import additionalBreakpoint from '../flagged/additionalBreakpoint'
import { flatMap, get } from 'lodash'

export default function getAllConfigs(config, defaultPresets = [defaultConfig]) {
  const configs = flatMap([...get(config, 'presets', defaultPresets)].reverse(), (preset) => {
    return getAllConfigs(preset, [])
  })

  const features = {
    additionalBreakpoint,
  }

  Object.keys(features).forEach((feature) => {
    if (flagEnabled(config, feature)) {
      configs.unshift(features[feature])
    }
  })

  return [config, ...configs]
}
