import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLookupValue } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('backgroundPosition', [['bg', ['background-position']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
