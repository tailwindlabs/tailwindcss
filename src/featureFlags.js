import _ from 'lodash'
import chalk from 'chalk'

const featureFlags = {
  future: [],
  experimental: ['uniformColorPalette'],
}

export function flagEnabled(config, flag) {
  if (featureFlags.future.includes(flag)) {
    return _.get(config, ['future', flag], false)
  }

  if (featureFlags.experimental.includes(flag)) {
    return _.get(config, ['experimental', flag], false)
  }

  return false
}

export function issueFlagNotices(config) {
  const log = {
    info(message) {
      console.log(chalk.bold.cyan('    info'), '-', message)
    },
    warn(message) {
      console.log(chalk.bold.yellow('    warn'), '-', message)
    },
    risk(message) {
      console.log(chalk.bold.magenta('    risk'), '-', message)
    },
  }

  if (_.some(featureFlags.future, flag => _.get(config, ['future', flag], false))) {
    const changes = Object.keys(config.future)
      .filter(flag => featureFlags.future.includes(flag) && config.future[flag])
      .map(s => chalk.cyan(s))
      .join(', ')
    console.log()
    log.info(`You have opted-in to future-facing breaking changes: ${changes}`)
    log.info(
      'These changes are stable and will be the default behavior in the next major version of Tailwind.'
    )
  }

  if (_.some(featureFlags.experimental, flag => _.get(config, ['experimental', flag], false))) {
    const changes = Object.keys(config.experimental)
      .filter(flag => featureFlags.experimental.includes(flag) && config.experimental[flag])
      .map(s => chalk.yellow(s))
      .join(', ')
    console.log()
    log.warn(`You have enabled experimental features: ${changes}`)
    log.warn(
      'Experimental features are not covered by semver, may introduce breaking changes, and can change at any time.'
    )
  }

  if (Object.keys(_.get(config, 'future', {})).length < featureFlags.future.length) {
    const changes = featureFlags.future
      .filter(flag => !_.has(config, ['future', flag]))
      .map(s => chalk.magenta(s))
      .join(', ')
    console.log()
    log.risk(`There are upcoming breaking changes: ${changes}`)
    log.risk(
      'We highly recommend opting-in to these changes now to simplify upgrading Tailwind in the future.'
    )
  }
}

export default featureFlags
