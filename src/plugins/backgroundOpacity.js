import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('backgroundOpacity', [['bg-opacity', ['--tw-bg-opacity']]])
}
