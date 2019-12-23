import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return function(...args) {
    ;[
      createUtilityPlugin('translate-x', 'translate', '--transform-translate-x'),
      createUtilityPlugin('translate-y', 'translate', '--transform-translate-y'),
    ].forEach(f => f(...args))
  }
}
