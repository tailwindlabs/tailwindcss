import createUtilityPlugin from '../util/createUtilityPlugin'
const { asLookupValue } = require('../../jit/pluginUtils')

export default function () {
  return createUtilityPlugin('fontFamily', [['font', ['fontFamily']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
