import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ config, ...args }) {
    if (config('target') === 'ie11') {
      return
    }

    createUtilityPlugin('skew', [
      ['skew-x', ['--transform-skew-x']],
      ['skew-y', ['--transform-skew-y']],
    ])({ config, ...args })
  }
}
