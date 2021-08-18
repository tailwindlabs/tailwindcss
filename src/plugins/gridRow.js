import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('gridRow', [['row', ['gridRow']]], {
    resolveArbitraryValue: asList,
  })
}
