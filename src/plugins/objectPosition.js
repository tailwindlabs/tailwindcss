import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('objectPosition', [['object', ['object-position']]], {
    resolveArbitraryValue: asList,
  })
}
