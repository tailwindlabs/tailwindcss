import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLookupValue } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('backgroundImage', [['bg', ['background-image']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
