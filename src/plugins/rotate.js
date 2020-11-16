import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('rotate', [['rotate', ['--tw-transform-rotate']]])
}
