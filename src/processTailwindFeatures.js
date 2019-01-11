import _ from 'lodash'
import postcss from 'postcss'

import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

import processPlugins from './util/processPlugins'
import defaultPlugins from './defaultPlugins'

export default function(getConfig) {
  return function(css) {
    const config = getConfig()
    const processedPlugins = processPlugins([...defaultPlugins(config), ...config.plugins], config)

    return postcss([
      substituteTailwindAtRules(config, processedPlugins, processedPlugins.utilities),
      evaluateTailwindFunctions(config),
      substituteVariantsAtRules(config, processedPlugins),
      substituteResponsiveAtRules(config),
      substituteScreenAtRules(config),
      substituteClassApplyAtRules(config, processedPlugins.utilities),
      function(root) {
        root.rawCache = {
          colon: ': ',
          indent: '  ',
          beforeDecl: '\n',
          beforeRule: '\n',
          beforeOpen: ' ',
          beforeClose: '\n',
          beforeComment: '\n',
          after: '\n',
          emptyBody: '',
          commentLeft: ' ',
          commentRight: ' ',
          semicolon: false,
        }
      },
    ]).process(css, { from: _.get(css, 'source.input.file') })
  }
}
