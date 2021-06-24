import { addBaseSelector } from './transform'
import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return function ({ config, ...rest }) {
    if (config('mode') === 'jit') {
      return createUtilityPlugin(
        'scale',
        [
          ['scale', ['--tw-scale-x', '--tw-scale-y', ['transform', 'var(--tw-transform)']]],
          [
            ['scale-x', ['--tw-scale-x', ['transform', 'var(--tw-transform)']]],
            ['scale-y', ['--tw-scale-y', ['transform', 'var(--tw-transform)']]],
          ],
        ],
        {
          lolback(_value, { selector }) {
            addBaseSelector(rest.memory, selector)
          },
        }
      )({ config, ...rest })
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
