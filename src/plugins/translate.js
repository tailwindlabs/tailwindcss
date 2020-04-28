import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('translate') === 'ie11') {
      return
    }

    createUtilityPlugin('translate', [
      ['translate-x', ['--transform-translate-x']],
      ['translate-y', ['--transform-translate-y']],
    ])({ target, ...args })
  }
}
