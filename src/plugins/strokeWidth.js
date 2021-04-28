import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLength } from '../jit/pluginUtils'

export default function () {
  return createUtilityPlugin('strokeWidth', [['stroke', ['stroke-width']]], {
    resolveArbitraryValue: asLength,
  })
}
