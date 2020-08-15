import _ from 'lodash'
import chalk from 'chalk'

const featureFlags = {
  future: ['removeDeprecatedGapUtilities'],
  experimental: [
    'uniformColorPalette',
    'extendedSpacingScale',
    'defaultLineHeights',
    'extendedFontSizeScale',
    'applyComplexClasses',
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

function futureFlagsEnabled(config) {
  if (config.future === 'all') {
    return featureFlags.future
  }

  return Object.keys(_.get(config, 'future', {})).filter(
    flag => featureFlags.future.includes(flag) && config.future[flag]
  )
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

export function issueFlagNotices(config) {
  const log = {
    info(message) {
      console.log(chalk.bold.cyan('info'), '-', message)
    },
    warn(message) {
      console.log(chalk.bold.yellow('warn'), '-', message)
    },
    risk(message) {
      console.log(chalk.bold.magenta('risk'), '-', message)
    },
  }

  if (futureFlagsEnabled(config).length > 0) {
    const changes = futureFlagsEnabled(config)
      .map(s => chalk.cyan(s))
      .join(', ')

    log.info(`\nYou have opted-in to future-facing breaking changes: ${changes}`)
    log.info(
      'These changes are stable and will be the default behavior in the next major version of Tailwind.'
    )
  }

  if (experimentalFlagsEnabled(config).length > 0) {
    const changes = experimentalFlagsEnabled(config)
      .map(s => chalk.yellow(s))
      .join(', ')

    log.warn(`\nYou have enabled experimental features: ${changes}`)
    log.warn(
      'Experimental features are not covered by semver, may introduce breaking changes, and can change at any time.'
    )
  }

  if (futureFlagsAvailable(config).length > 0) {
    const changes = futureFlagsAvailable(config)
      .map(s => chalk.magenta(s))
      .join(', ')

    log.risk(`\nThere are upcoming breaking changes: ${changes}`)
    log.risk(
      'We highly recommend opting-in to these changes now to simplify upgrading Tailwind in the future.'
    )
    log.risk('https://tailwindcss.com/docs/upcoming-changes')
  }
}

export default featureFlags
