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
    'extendedSpacingScale',
    'extendedFontSizeScale',
    'applyComplexClasses',
    'darkModeVariant',
    'additionalBreakpoint',
    'redesignedColorPalette',
  ],
  removed: {
    uniformColorPalette: [
      `The ${chalk.red(
        'uniformColorPalette'
      )} experiment has been removed in favor of a different color palette.`,
      'If you would like to continue using this palette, you can copy it manually from here:',
      'https://github.com/tailwindlabs/tailwindcss/blob/753925f72c61980fa6d7ba398b7e2a1ba0e4b438/src/flagged/uniformColorPalette.js',
    ],
  },
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

function futureFlagsAvailable(config) {
  if (config.future === 'all') {
    return []
  }

  return featureFlags.future.filter(flag => !_.has(config, ['future', flag]))
}

function removedFlagsEnabled(config) {
  if (config.experimental === 'all') {
    return false
  }

  return Object.keys(_.get(config, 'experimental', {})).filter(
    flag => Object.keys(featureFlags.removed).includes(flag) && config.experimental[flag]
  )
}

export function issueFlagNotices(config) {
  if (removedFlagsEnabled(config).length > 0) {
    removedFlagsEnabled(config).forEach(flag => {
      log.error(featureFlags.removed[flag])
    })

    console.warn('')
    throw new Error('Enabled experimental features have been removed.')
  }

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

  if (futureFlagsAvailable(config).length > 0) {
    const changes = futureFlagsAvailable(config)
      .map(s => chalk.magenta(s))
      .join(', ')

    log.risk([
      `There are upcoming breaking changes: ${changes}`,
      'We highly recommend opting-in to these changes now to simplify upgrading Tailwind in the future.',
      'https://tailwindcss.com/docs/upcoming-changes',
    ])
  }
}

export default featureFlags
