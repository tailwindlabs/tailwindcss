import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLength } from '../util/pluginUtils'

export default function () {
  return createUtilityPlugin('strokeWidth', [['stroke', ['stroke-width']]], {
    resolveArbitraryValue: asLength,
  })
}
