import normalizeTailwindDirectives from './lib/normalizeTailwindDirectives'
import setupTrackingContext from './lib/setupTrackingContext'
import setupWatchingContext from './lib/setupWatchingContext'
import { env } from './lib/sharedState'
import processTailwindFeatures from './processTailwindFeatures'

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
          plugin: 'tailwindcss',
          parent: result.opts.from,
          [type === 'dir-dependency' ? 'dir' : 'file']: fileName,
        })
      }

      let tailwindDirectives = normalizeTailwindDirectives(root)

      let context =
        env.TAILWIND_MODE === 'watch'
          ? setupWatchingContext(configOrPath, tailwindDirectives, registerDependency)(result, root)
          : setupTrackingContext(configOrPath, tailwindDirectives, registerDependency)(result, root)

      processTailwindFeatures(context)(root, result)
    },
    env.DEBUG &&
      function (root) {
        console.timeEnd('JIT TOTAL')
        console.log('\n')
        return root
      },
  ].filter(Boolean)
}
