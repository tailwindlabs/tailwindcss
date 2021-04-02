const postcss = require('postcss')

const evaluateTailwindFunctions = require('../lib/lib/evaluateTailwindFunctions').default
const substituteScreenAtRules = require('../lib/lib/substituteScreenAtRules').default

const rewriteTailwindImports = require('./lib/rewriteTailwindImports')
const setupContext = require('./lib/setupContext')
const removeLayerAtRules = require('./lib/removeLayerAtRules')
const expandTailwindAtRules = require('./lib/expandTailwindAtRules')
const expandApplyAtRules = require('./lib/expandApplyAtRules')
const collapseAdjacentRules = require('./lib/collapseAdjacentRules')

const { env } = require('./lib/sharedState')

module.exports = (configOrPath = {}) => {
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

      rewriteTailwindImports(root)

      let context = setupContext(configOrPath)(result, root)

      if (!env.TAILWIND_DISABLE_TOUCH) {
        if (context.configPath !== null) {
          registerDependency(context.configPath)
        }
      }

      return postcss([
        removeLayerAtRules(context),
        expandTailwindAtRules(context, registerDependency),
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

module.exports.postcss = true
