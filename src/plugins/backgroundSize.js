import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLookupValue } from '../jit/pluginUtils'

export default function () {
  return createUtilityPlugin('backgroundSize', [['bg', ['background-size']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
