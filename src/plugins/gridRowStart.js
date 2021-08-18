import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('gridRowStart', [['row-start', ['gridRowStart']]], {
    resolveArbitraryValue: asList,
  })
}
