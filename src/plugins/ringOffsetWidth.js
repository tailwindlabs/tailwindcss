import createUtilityPlugin from '../util/createUtilityPlugin'
import { asLength } from '../jit/pluginUtils'

export default function () {
  return createUtilityPlugin('ringOffsetWidth', [['ring-offset', ['--tw-ring-offset-width']]], {
    resolveArbitraryValue: asLength,
  })
}
