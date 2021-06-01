import normalizeTailwindDirectives from './lib/normalizeTailwindDirectives'
import expandTailwindAtRules from './lib/expandTailwindAtRules'
import expandApplyAtRules from './lib/expandApplyAtRules'
import evaluateTailwindFunctions from '../lib/evaluateTailwindFunctions'
import substituteScreenAtRules from '../lib/substituteScreenAtRules'
import collapseAdjacentRules from './lib/collapseAdjacentRules'
import { createContext } from './lib/setupContextUtils'

export default function processTailwindFeatures(setupContext) {
  return function (root, result) {
    function registerDependency(dependency) {
      // rollup-plugin-postcss does not support dir-dependency messages
      // but directories can be watched in the same way as files
      if (dependency.dir && process.env.ROLLUP_WATCH === 'true') {
        dependency = { file: dependency.dir }
      }

      result.messages.push({
        type: dependency.dir ? 'dir-dependency' : 'dependency',
        plugin: 'tailwindcss',
        parent: result.opts.from,
        ...dependency,
      })
    }

    let tailwindDirectives = normalizeTailwindDirectives(root)

    let context = setupContext({
      tailwindDirectives,
      registerDependency,
      createContext(tailwindConfig, changedContent) {
        return createContext(tailwindConfig, changedContent, tailwindDirectives, root)
      },
    })(root, result)

    expandTailwindAtRules(context)(root, result)
    expandApplyAtRules(context)(root, result)
    evaluateTailwindFunctions(context)(root, result)
    substituteScreenAtRules(context)(root, result)
    collapseAdjacentRules(context)(root, result)
  }
}
