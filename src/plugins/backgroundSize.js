import createUtilityPlugin from '../util/createUtilityPlugin'
const { asLookupValue } = require('../../jit/pluginUtils')

export default function () {
  return createUtilityPlugin('backgroundSize', [['bg', ['background-size']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
