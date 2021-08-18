import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('gridAutoColumns', [['auto-cols', ['gridAutoColumns']]], {
    resolveArbitraryValue: asList,
  })
}
