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

      // This quick plugin is necessary to avoid a serious performance
      // hit due to nodes created by postcss-js having an empty `raws`
      // value, and PostCSS not providing a default `raws.semicolon`
      // value. This turns determining what value to use there into an
      // O(n) operation instead of an O(1) operation.
      //
      // The latest version of PostCSS 7.x has this patched internally,
      // but patching from userland until we upgrade from v6 to v7.
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
