import normalizeTailwindDirectives from './lib/normalizeTailwindDirectives'
import expandTailwindAtRules from './lib/expandTailwindAtRules'
import expandApplyAtRules from './lib/expandApplyAtRules'
import evaluateTailwindFunctions from './lib/evaluateTailwindFunctions'
import substituteScreenAtRules from './lib/substituteScreenAtRules'
import resolveDefaultsAtRules from './lib/resolveDefaultsAtRules'
import collapseAdjacentRules from './lib/collapseAdjacentRules'
import detectNesting from './lib/detectNesting'
import { createContext } from './lib/setupContextUtils'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import dlv from 'dlv'

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

    return postcss([
      detectNesting(context, (rule, warning) => rule.warn(result, warning)),
      expandTailwindAtRules(context),
      expandApplyAtRules(context),
      evaluateTailwindFunctions(context),
      substituteScreenAtRules(context),
      resolveDefaultsAtRules(context),
      collapseAdjacentRules(context),
      ...(context.tailwindConfig.autoprefixer ? [autoprefixer] : []),
    ]).process(root, { from: dlv(root, 'source.input.file') })
  }
}
