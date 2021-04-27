import createUtilityPlugin from '../util/createUtilityPlugin'
const { asLength } = require('../../jit/pluginUtils')

export default function () {
  return createUtilityPlugin('strokeWidth', [['stroke', ['stroke-width']]], {
    resolveArbitraryValue: asLength,
  })
}
