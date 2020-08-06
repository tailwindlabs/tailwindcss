import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function({ target, ...args }) {
    if (target('translate') === 'ie11') {
      createUtilityPlugin('translate', [
        ['translate-x', ['transform'], value => `translateX(${value})`],
        ['translate-y', ['transform'], value => `translateY(${value})`],
      ])({ target, ...args })

      return
    }

    createUtilityPlugin('translate', [
      ['translate-x', ['--transform-translate-x']],
      ['translate-y', ['--transform-translate-y']],
    ])({ target, ...args })
  }
}
