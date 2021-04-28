import createUtilityPlugin from '../util/createUtilityPlugin'
const { asLength } = require('../../jit/pluginUtils')

export default function () {
  return createUtilityPlugin('ringOffsetWidth', [['ring-offset', ['--tw-ring-offset-width']]], {
    resolveArbitraryValue: asLength,
  })
}
