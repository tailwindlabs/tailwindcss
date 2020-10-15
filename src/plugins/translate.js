import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('translate', [
    ['translate-x', ['--transform-translate-x']],
    ['translate-y', ['--transform-translate-y']],
  ])
}
