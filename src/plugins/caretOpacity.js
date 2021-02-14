import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('caretOpacity', [['caret-opacity', ['--tw-caret-opacity']]])
}
