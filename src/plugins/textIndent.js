import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('textIndent', [['indent', ['text-indent']]])
}
