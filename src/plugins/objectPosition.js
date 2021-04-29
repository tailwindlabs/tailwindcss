import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLookupValue } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('objectPosition', [['object', ['object-position']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
