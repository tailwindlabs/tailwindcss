import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLookupValue } from '../jit/pluginUtils'

export default function () {
  return createUtilityPlugin('fontWeight', [['font', ['fontWeight']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
