import createUtilityPlugin from '../util/createUtilityPlugin'
import { transformVars } from './transform'

export default function () {
  return function ({ config, ...rest }) {
    if (config('mode') === 'jit') {
      return createUtilityPlugin('rotate', [
        ['rotate', ['--tw-rotate', ['transform', transformVars]]],
      ])({ config, ...rest })
    } else {
      return createUtilityPlugin('rotate', [['rotate', ['--tw-rotate']]])({ config, ...rest })
    }
  }
}
