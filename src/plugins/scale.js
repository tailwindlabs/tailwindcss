import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('scale', [
    ['scale', ['--transform-scale-x', '--transform-scale-y']],
    ['scale-x', ['--transform-scale-x']],
    ['scale-y', ['--transform-scale-y']],
  ])
}
