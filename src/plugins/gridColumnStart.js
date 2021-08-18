import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('gridColumnStart', [['col-start', ['gridColumnStart']]], {
    resolveArbitraryValue: asList,
  })
}
