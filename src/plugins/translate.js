import createUtilityPlugin from '../util/createUtilityPlugin'
import { transformVars } from './transform'

export default function () {
  return function ({ config, ...rest }) {
    if (config('mode') === 'jit') {
      return createUtilityPlugin('translate', [
        [
          ['translate-x', ['--tw-translate-x', ['transform', transformVars]]],
          ['translate-y', ['--tw-translate-y', ['transform', transformVars]]],
        ],
      ])({ config, ...rest })
    } else {
      return createUtilityPlugin('translate', [
        [
          ['translate-x', ['--tw-translate-x']],
          ['translate-y', ['--tw-translate-y']],
        ],
      ])({ config, ...rest })
    }
  }
}
