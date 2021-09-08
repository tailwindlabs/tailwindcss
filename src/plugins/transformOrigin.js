import createUtilityPlugin from '../util/createUtilityPlugin'
import { asList } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('transformOrigin', [['origin', ['transformOrigin']]]), {
    resolveArbitraryValue: asList,
  })
}
