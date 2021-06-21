import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return function ({ config, ...rest }) {
    if (config('mode') === 'jit') {
      return createUtilityPlugin('rotate', [
        ['rotate', ['--tw-rotate', ['transform', 'var(--tw-transform)']]],
      ])({ config, ...rest })
    } else {
      return createUtilityPlugin('rotate', [['rotate', ['--tw-rotate']]])({ config, ...rest })
    }
  }
}
