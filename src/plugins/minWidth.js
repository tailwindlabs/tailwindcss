import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('minWidth', [['min-w', ['minWidth']]])
}
