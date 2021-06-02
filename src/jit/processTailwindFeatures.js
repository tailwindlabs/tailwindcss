import normalizeTailwindDirectives from './lib/normalizeTailwindDirectives'
import expandTailwindAtRules from './lib/expandTailwindAtRules'
import expandApplyAtRules from './lib/expandApplyAtRules'
import evaluateTailwindFunctions from '../lib/evaluateTailwindFunctions'
import substituteScreenAtRules from '../lib/substituteScreenAtRules'
import collapseAdjacentRules from './lib/collapseAdjacentRules'
import { createContext } from './lib/setupContextUtils'

export default function processTailwindFeatures(setupContext) {
  return function (root, result) {
    let tailwindDirectives = normalizeTailwindDirectives(root)

    let context = setupContext({
      tailwindDirectives,
      registerDependency(dependency) {
        result.messages.push({
          plugin: 'tailwindcss',
          parent: result.opts.from,
          ...dependency,
        })
      },
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
