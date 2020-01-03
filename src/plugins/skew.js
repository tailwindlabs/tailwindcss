import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('skew', [
    ['skew-x', ['--transform-skew-x']],
    ['skew-y', ['--transform-skew-y']],
  ])
}
