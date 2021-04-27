import createUtilityPlugin from '../util/createUtilityPlugin'
const { asLookupValue } = require('../../jit/pluginUtils')

export default function () {
  return createUtilityPlugin('objectPosition', [['object', ['object-position']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
