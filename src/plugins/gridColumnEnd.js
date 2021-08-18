import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('gridColumnEnd', [['col-end', ['gridColumnEnd']]], {
    resolveArbitraryValue: asList,
  })
}
