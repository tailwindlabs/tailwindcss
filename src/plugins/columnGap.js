import createUtilityPlugin from '../util/createUtilityPlugin'

export default function() {
  return createUtilityPlugin('columnGap', [['col-gap', ['gridColumnGap', 'columnGap']]])
}
