import createUtilityPlugin from '../util/createUtilityPlugin'
import { transformVars } from './transform'

export default function () {
  return function ({ config, ...rest }) {
    if (config('mode') === 'jit') {
      return createUtilityPlugin('skew', [
        [
          ['skew-x', ['--tw-skew-x', ['transform', transformVars]]],
          ['skew-y', ['--tw-skew-y', ['transform', transformVars]]],
        ],
      ])({ config, ...rest })
    } else {
      return createUtilityPlugin('skew', [
        [
          ['skew-x', ['--tw-skew-x']],
          ['skew-y', ['--tw-skew-y']],
        ],
      ])({ config, ...rest })
    }
  }
}
