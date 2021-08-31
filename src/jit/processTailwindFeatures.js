import normalizeTailwindDirectives from './lib/normalizeTailwindDirectives'
import expandTailwindAtRules from './lib/expandTailwindAtRules'
import expandApplyAtRules from './lib/expandApplyAtRules'
import evaluateTailwindFunctions from '../lib/evaluateTailwindFunctions'
import substituteScreenAtRules from '../lib/substituteScreenAtRules'
import resolveDefaultsAtRules from './lib/resolveDefaultsAtRules'
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

    if (context.tailwindConfig.separator === '-') {
      throw new Error(
        "The '-' character cannot be used as a custom separator in JIT mode due to parsing ambiguity. Please use another character like '_' instead."
      )
    }

    expandTailwindAtRules(context)(root, result)
    expandApplyAtRules(context)(root, result)
    evaluateTailwindFunctions(context)(root, result)
    substituteScreenAtRules(context)(root, result)
    resolveDefaultsAtRules(context)(root, result)
    collapseAdjacentRules(context)(root, result)
  }
}
