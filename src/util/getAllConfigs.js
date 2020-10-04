import defaultConfig from '../../stubs/defaultConfig.stub.js'
import { flagEnabled } from '../featureFlags'
import uniformColorPalette from '../flagged/uniformColorPalette.js'
import extendedSpacingScale from '../flagged/extendedSpacingScale.js'
import defaultLineHeights from '../flagged/defaultLineHeights.js'
import extendedFontSizeScale from '../flagged/extendedFontSizeScale.js'
import darkModeVariant from '../flagged/darkModeVariant.js'
import standardFontWeights from '../flagged/standardFontWeights'
import additionalBreakpoint from '../flagged/additionalBreakpoint'
import redesignedColorPalette from '../flagged/redesignedColorPalette'

export default function getAllConfigs(config) {
  const configs = [defaultConfig]
  const features = {
    uniformColorPalette,
    extendedSpacingScale,
    defaultLineHeights,
    extendedFontSizeScale,
    standardFontWeights,
    darkModeVariant,
    additionalBreakpoint,
    redesignedColorPalette,
  }

  Object.keys(features).forEach(feature => {
    if (flagEnabled(config, feature)) {
      configs.unshift(features[feature])
    }
  })

  return [config, ...configs]
}
