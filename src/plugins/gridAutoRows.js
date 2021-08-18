import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('gridAutoRows', [['auto-rows', ['gridAutoRows']]], {
    resolveArbitraryValue: asList,
  })
}
