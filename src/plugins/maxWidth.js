import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('maxWidth', [['max-w', ['maxWidth']]])
}
