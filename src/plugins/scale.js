import createUtilityPlugin from '../util/createUtilityPlugin'
import { transformVars } from './transform'

export default function () {
  return function ({ config, ...rest }) {
    if (config('mode') === 'jit') {
      return createUtilityPlugin('scale', [
        ['scale', ['--tw-scale-x', '--tw-scale-y', ['transform', transformVars]]],
        [
          ['scale-x', ['--tw-scale-x', ['transform', transformVars]]],
          ['scale-y', ['--tw-scale-y', ['transform', transformVars]]],
        ],
      ])({ config, ...rest })
    } else {
      return createUtilityPlugin('scale', [
        ['scale', ['--tw-scale-x', '--tw-scale-y']],
        [
          ['scale-x', ['--tw-scale-x']],
          ['scale-y', ['--tw-scale-y']],
        ],
      ])({ config, ...rest })
    }
  }
}
