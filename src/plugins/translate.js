import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('translate', [
    ['translate-x', ['--tw-transform-translate-x']],
    ['translate-y', ['--tw-transform-translate-y']],
  ])
}
