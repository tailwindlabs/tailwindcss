import { addBaseSelector } from './transform'
import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return function ({ config, ...rest }) {
    if (config('mode') === 'jit') {
      return createUtilityPlugin(
        'rotate',
        [['rotate', ['--tw-rotate', ['transform', 'var(--tw-transform)']]]],
        {
          lolback(_value, { selector }) {
            addBaseSelector(rest.memory, selector)
          },
        }
      )({ config, ...rest })
    } else {
      return createUtilityPlugin('rotate', [['rotate', ['--tw-rotate']]])({ config, ...rest })
    }
  }
}
