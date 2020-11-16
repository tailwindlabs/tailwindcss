import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('scale', [
    ['scale', ['--tw-transform-scale-x', '--tw-transform-scale-y']],
    ['scale-x', ['--tw-transform-scale-x']],
    ['scale-y', ['--tw-transform-scale-y']],
  ])
}
