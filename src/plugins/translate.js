import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ config, ...args }) {
    if (config('target') === 'ie11') {
      return
    }

    createUtilityPlugin('translate', [
      ['translate-x', ['--transform-translate-x']],
      ['translate-y', ['--transform-translate-y']],
    ])({ config, ...args })
  }
}
