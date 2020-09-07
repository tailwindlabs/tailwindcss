import defaultConfig from '../../stubs/defaultConfig.stub.js'
import { flagEnabled } from '../featureFlags'
import uniformColorPalette from '../flagged/uniformColorPalette.js'
import extendedSpacingScale from '../flagged/extendedSpacingScale.js'
import defaultLineHeights from '../flagged/defaultLineHeights.js'
import extendedFontSizeScale from '../flagged/extendedFontSizeScale.js'
import darkModeVariant from '../flagged/darkModeVariant.js'
import standardFontWeights from '../flagged/standardFontWeights'

export default function getAllConfigs(config) {
  const configs = [defaultConfig]

  if (flagEnabled(config, 'uniformColorPalette')) {
    configs.unshift(uniformColorPalette)
  }

  if (flagEnabled(config, 'extendedSpacingScale')) {
    configs.unshift(extendedSpacingScale)
  }

  if (flagEnabled(config, 'defaultLineHeights')) {
    configs.unshift(defaultLineHeights)
  }

  if (flagEnabled(config, 'extendedFontSizeScale')) {
    configs.unshift(extendedFontSizeScale)
  }

  if (flagEnabled(config, 'standardFontWeights')) {
    configs.unshift(standardFontWeights)
  }

  if (flagEnabled(config, 'darkModeVariant')) {
    configs.unshift(darkModeVariant)
    if (Array.isArray(config.plugins)) {
      config.plugins = [...darkModeVariant.plugins, ...config.plugins]
    }
  }

  return [config, ...configs]
}
