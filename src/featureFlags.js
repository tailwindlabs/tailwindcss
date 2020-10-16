import _ from 'lodash'
import chalk from 'chalk'
import log from './util/log'

const featureFlags = {
  future: [
    'removeDeprecatedGapUtilities',
    'purgeLayersByDefault',
    'defaultLineHeights',
    'standardFontWeights',
  ],
  experimental: [
    'uniformColorPalette',
    'extendedSpacingScale',
    'extendedFontSizeScale',
    'applyComplexClasses',
    'darkModeVariant',
    'additionalBreakpoint',
  ],
}

export function flagEnabled(config, flag) {
  if (featureFlags.future.includes(flag)) {
    return config.future === 'all' || _.get(config, ['future', flag], false)
  }

  if (featureFlags.experimental.includes(flag)) {
    return config.experimental === 'all' || _.get(config, ['experimental', flag], false)
  }

  return false
}

function experimentalFlagsEnabled(config) {
  if (config.experimental === 'all') {
    return featureFlags.experimental
  }

  return Object.keys(_.get(config, 'experimental', {})).filter(
    flag => featureFlags.experimental.includes(flag) && config.experimental[flag]
  )
}

export function issueFlagNotices(config) {
  if (process.env.JEST_WORKER_ID !== undefined) {
    return
  }

  if (experimentalFlagsEnabled(config).length > 0) {
    const changes = experimentalFlagsEnabled(config)
      .map(s => chalk.yellow(s))
      .join(', ')

    log.warn([
      `You have enabled experimental features: ${changes}`,
      'Experimental features are not covered by semver, may introduce breaking changes, and can change at any time.',
    ])
  }
}

export default featureFlags
