import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLookupValue } from '../jit/pluginUtils'

export default function () {
  return createUtilityPlugin('fontFamily', [['font', ['fontFamily']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
