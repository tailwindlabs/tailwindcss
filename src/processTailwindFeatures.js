import normalizeTailwindDirectives from './lib/normalizeTailwindDirectives'
import expandTailwindAtRules from './lib/expandTailwindAtRules'
import expandApplyAtRules from './lib/expandApplyAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import resolveDefaultsAtRules from './lib/resolveDefaultsAtRules'
import collapseAdjacentRules from './lib/collapseAdjacentRules'
import collapseDuplicateDeclarations from './lib/collapseDuplicateDeclarations'
import detectNesting from './lib/detectNesting'
import { createContext } from './lib/setupContextUtils'
import { issueFlagNotices } from './featureFlags'

export default function processTailwindFeatures(setupContext) {
  return function (root, result) {
    let { tailwindDirectives, applyDirectives } = normalizeTailwindDirectives(root)

    detectNesting()(root, result)

    let context = setupContext({
      tailwindDirectives,
      applyDirectives,
      registerDependency(dependency) {
        result.messages.push({
          plugin: 'tailwindcss',
          parent: result.opts.from,
          ...dependency,
        })
      },
      createContext(tailwindConfig, changedContent) {
        return createContext(tailwindConfig, changedContent, root)
      },
    })(root, result)

    if (context.tailwindConfig.separator === '-') {
      throw new Error(
        "The '-' character cannot be used as a custom separator in JIT mode due to parsing ambiguity. Please use another character like '_' instead."
      )
    }

    issueFlagNotices(context.tailwindConfig)

    expandTailwindAtRules(context)(root, result)
    expandApplyAtRules(context)(root, result)
    evaluateTailwindFunctions(context)(root, result)
    substituteScreenAtRules(context)(root, result)
    resolveDefaultsAtRules(context)(root, result)
    collapseAdjacentRules(context)(root, result)
    collapseDuplicateDeclarations(context)(root, result)
  }
}
