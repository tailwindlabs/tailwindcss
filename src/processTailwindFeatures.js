import _ from 'lodash'
import postcss from 'postcss'

import substituteTailwindAtRules from './lib/substituteTailwindAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteVariantsAtRules from './lib/substituteVariantsAtRules'
import substituteResponsiveAtRules from './lib/substituteResponsiveAtRules'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import substituteClassApplyAtRules from './lib/substituteClassApplyAtRules'

import corePlugins from './corePlugins'
import processPlugins from './util/processPlugins'

import { calculate } from 'specificity'

export default function(getConfig) {
  return function(css) {
    const config = getConfig()
    const processedPlugins = processPlugins([...corePlugins(config), ...config.plugins], config)

    return postcss([
      substituteTailwindAtRules(config, processedPlugins),
      evaluateTailwindFunctions(config),
      substituteVariantsAtRules(config, processedPlugins),
      function(css) {
        function buildSpecificityTable(css) {
          const classTable = {}

          css.walkRules(rule => {
            rule.selectors.forEach(selector => {
              if (!_.has(classTable, selector)) {
                classTable[selector] = calculate(selector)[0].specificityArray[2]
              }
            })
          })

          return classTable
        }

        const specificityTable = buildSpecificityTable(css)
        const maxSpecificity = Math.max(
          ...Object.entries(specificityTable).map(([key, value]) => value)
        )

        css.walkRules(rule => {
          rule.selectors = rule.selectors.map(selector => {
            const multiplier = maxSpecificity - specificityTable[selector]

            return `${':root'.repeat(multiplier)} ${selector}`.trim()
          })
        })
      },
      substituteResponsiveAtRules(config),
      substituteScreenAtRules(config),
      substituteClassApplyAtRules(config, processedPlugins.utilities),
    ]).process(css, { from: _.get(css, 'source.input.file') })
  }
}
