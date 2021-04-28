import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLookupValue } from '../jit/pluginUtils'

export default function () {
  return createUtilityPlugin('objectPosition', [['object', ['object-position']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
