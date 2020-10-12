import defaultConfig from '../../stubs/defaultConfig.stub.js'
import { flagEnabled } from '../featureFlags'
import uniformColorPalette from '../flagged/uniformColorPalette.js'
import extendedSpacingScale from '../flagged/extendedSpacingScale.js'
import defaultLineHeights from '../flagged/defaultLineHeights.js'
import extendedFontSizeScale from '../flagged/extendedFontSizeScale.js'
import darkModeVariant from '../flagged/darkModeVariant.js'
import standardFontWeights from '../flagged/standardFontWeights'
import additionalBreakpoint from '../flagged/additionalBreakpoint'
import { flatMap, get } from 'lodash'

export default function getAllConfigs(config, defaultPresets = [defaultConfig]) {
  const configs = flatMap([...get(config, 'presets', defaultPresets)].reverse(), preset => {
    return getAllConfigs(preset, [])
  })

  const features = {
    uniformColorPalette,
    extendedSpacingScale,
    defaultLineHeights,
    extendedFontSizeScale,
    standardFontWeights,
    darkModeVariant,
    additionalBreakpoint,
  }

  Object.keys(features).forEach(feature => {
    if (flagEnabled(config, feature)) {
      configs.unshift(features[feature])
    }
  })

  return [config, ...configs]
}
