import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('gridRowEnd', [['row-end', ['gridRowEnd']]], {
    resolveArbitraryValue: asList,
  })
}
