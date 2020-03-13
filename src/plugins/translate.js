import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('translate', [
    ['translate', ['--transform-translate-x', '--transform-translate-y']],
    ['translate-x', ['--transform-translate-x']],
    ['translate-y', ['--transform-translate-y']],
  ])
}
