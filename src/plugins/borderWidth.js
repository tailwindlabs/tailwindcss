import { asLength } from '../util/pluginUtils'
import createUtilityPlugin from '../util/createUtilityPlugin'

export default function () {
  return createUtilityPlugin(
    'borderWidth',
    [
      ['border', ['border-width']],
      [
        ['border-t', ['border-top-width']],
        ['border-r', ['border-right-width']],
        ['border-b', ['border-bottom-width']],
        ['border-l', ['border-left-width']],
      ],
    ],
    { resolveArbitraryValue: asLength }
  )
}
