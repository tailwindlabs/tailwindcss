import { asList } from '../util/pluginUtils'
import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin('gridColumn', [['col', ['gridColumn']]], {
    resolveArbitraryValue: asList,
  })
}
