import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('skew', [
    ['skew-x', ['--tw-skew-x']],
    ['skew-y', ['--tw-skew-y']],
  ])
}
