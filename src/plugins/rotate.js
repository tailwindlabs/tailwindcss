import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('rotate', [
    ['rotate', ['--transform-rotate-x', '--transform-rotate-y']],
    ['rotate-x', ['--transform-rotate-x']],
    ['rotate-y', ['--transform-rotate-y']],
  ])
}
