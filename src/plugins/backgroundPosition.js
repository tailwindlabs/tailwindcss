import createUtilityPlugin from '../util/createUtilityPlugin'
const { asLookupValue } = require('../../jit/pluginUtils')

export default function () {
  return createUtilityPlugin('backgroundPosition', [['bg', ['background-position']]], {
    resolveArbitraryValue: asLookupValue,
  })
}
