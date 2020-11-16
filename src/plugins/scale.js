import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('scale', [
    ['scale', ['--tw-scale-x', '--tw-scale-y']],
    ['scale-x', ['--tw-scale-x']],
    ['scale-y', ['--tw-scale-y']],
  ])
}
