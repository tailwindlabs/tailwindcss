import createUtilityPlugin from '../util/createUtilityPlugin'
const { asLookupValue } = require('../../jit/pluginUtils')

export default function () {
  return createUtilityPlugin('fontWeight', [['font', ['fontWeight']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
