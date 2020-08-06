import _ from 'lodash'
import postcss from 'postcss'

import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import convertLayerAtRulesToControlComments from './lib/convertLayerAtRulesToControlComments'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'
import purgeUnusedStyles from './lib/purgeUnusedStyles'

import corePlugins from './corePlugins'
import processPlugins from './util/processPlugins'
import cloneNodes from './util/cloneNodes'
import chalk from 'chalk'

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

function issueFlagNotices(config) {
  const featureFlags = {
    future: [],
    experimental: ['uniformColorPalette'],
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

export default function(getConfig) {
  return function(css) {
    const config = getConfig()

    issueFlagNotices(config)

    const processedPlugins = processPlugins([...corePlugins(config), ...config.plugins], config)

    const getProcessedPlugins = function() {
      return {
        ...processedPlugins,
        base: cloneNodes(processedPlugins.base),
        components: cloneNodes(processedPlugins.components),
        utilities: cloneNodes(processedPlugins.utilities),
      }
    }

    return postcss([
      substituteTailwindAtRules(config, getProcessedPlugins()),
      evaluateTailwindFunctions(config),
      substituteVariantsAtRules(config, getProcessedPlugins()),
      substituteResponsiveAtRules(config),
      convertLayerAtRulesToControlComments(config),
      substituteScreenAtRules(config),
      substituteClassApplyAtRules(config, getProcessedPlugins().utilities),
      purgeUnusedStyles(config),
    ]).process(css, { from: _.get(css, 'source.input.file') })
  }
}
