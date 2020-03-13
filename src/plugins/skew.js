import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('skew', [
    ['skew', ['--transform-skew-x', '--transform-skew-y']],
    ['skew-x', ['--transform-skew-x']],
    ['skew-y', ['--transform-skew-y']],
  ])
}
