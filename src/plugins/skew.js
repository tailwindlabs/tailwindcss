import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return function ({ config, ...rest }) {
    if (config('mode') === 'jit') {
      return createUtilityPlugin('skew', [
        [
          [
            'skew-x',
            [['@defaults transform', {}], '--tw-skew-x', ['transform', 'var(--tw-transform)']],
          ],
          [
            'skew-y',
            [['@defaults transform', {}], '--tw-skew-y', ['transform', 'var(--tw-transform)']],
          ],
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
