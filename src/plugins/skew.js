import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('skew', [
    ['skew-x', ['--tw-transform-skew-x']],
    ['skew-y', ['--tw-transform-skew-y']],
  ])
}
