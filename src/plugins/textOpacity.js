import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('textOpacity', [['text-opacity', ['--tw-text-opacity']]])
}
