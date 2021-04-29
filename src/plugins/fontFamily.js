import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLookupValue } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('fontFamily', [['font', ['fontFamily']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
