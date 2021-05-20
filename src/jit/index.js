import postcss from 'postcss'

import evaluateTailwindFunctions from '../lib/evaluateTailwindFunctions'
import substituteScreenAtRules from '../lib/substituteScreenAtRules'

import normalizeTailwindDirectives from './lib/normalizeTailwindDirectives'
import setupContext from './lib/setupContext'
import removeLayerAtRules from './lib/removeLayerAtRules'
import expandTailwindAtRules from './lib/expandTailwindAtRules'
import expandApplyAtRules from './lib/expandApplyAtRules'
import collapseAdjacentRules from './lib/collapseAdjacentRules'

import { env } from './lib/sharedState'

export default function (configOrPath = {}) {
  return [
    env.DEBUG &&
      function (root) {
        console.log('\n')
        console.time('JIT TOTAL')
        return root
      },
    function (root, result) {
      function registerDependency(fileName, type = 'dependency') {
        result.messages.push({
          type,
          plugin: 'tailwindcss-jit',
          parent: result.opts.from,
          file: fileName,
        })
      }

      let tailwindDirectives = normalizeTailwindDirectives(root)

      let context = setupContext(configOrPath, tailwindDirectives)(result, root)

      if (!env.TAILWIND_DISABLE_TOUCH) {
        if (context.configPath !== null) {
          registerDependency(context.configPath)
        }
      }

      return postcss([
        removeLayerAtRules(context, tailwindDirectives),
        expandTailwindAtRules(context, registerDependency, tailwindDirectives),
        expandApplyAtRules(context),
        evaluateTailwindFunctions(context.tailwindConfig),
        substituteScreenAtRules(context.tailwindConfig),
        collapseAdjacentRules(context),
      ]).process(root, { from: undefined })
    },
    env.DEBUG &&
      function (root) {
        console.timeEnd('JIT TOTAL')
        console.log('\n')
        return root
      },
  ].filter(Boolean)
}
