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
      let setupContext =
        env.TAILWIND_MODE === 'watch'
          ? setupWatchingContext(configOrPath)
          : setupTrackingContext(configOrPath)

      processTailwindFeatures(setupContext)(root, result)
    },
    env.DEBUG &&
      function (root) {
        console.timeEnd('JIT TOTAL')
        console.log('\n')
        return root
      },
  ].filter(Boolean)
}
