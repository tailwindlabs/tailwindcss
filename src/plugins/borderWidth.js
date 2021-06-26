import { asLength } from '../util/pluginUtils'
import createUtilityPlugin from '../util/createUtilityPlugin'
import withAlphaVariable from '../util/withAlphaVariable'
import postcss from 'postcss'
import parseObjectStyles from '../util/parseObjectStyles'

let baseRulesKey = Symbol()

function addBaseSelector(memory, corePlugins, theme, selector) {
  let baseRoot = memory.get(baseRulesKey)

  if (baseRoot.nodes.length === 0) {
    if (!corePlugins('borderOpacity')) {
      baseRoot.append(
        parseObjectStyles({
          [selector]: {
            'border-color': theme('borderColor.DEFAULT', 'currentColor'),
          },
        })
      )
    } else {
      baseRoot.append(
        parseObjectStyles({
          [selector]: withAlphaVariable({
            color: theme('borderColor.DEFAULT', 'currentColor'),
            property: 'border-color',
            variable: '--tw-border-opacity',
          }),
        })
      )
    }
  } else {
    baseRoot.nodes[0].selectors = [...baseRoot.nodes[0].selectors, selector]
  }
}

export default function () {
  return function (pluginApi) {
    if (pluginApi.config('mode') === 'jit') {
      let baseRoot = postcss.root()
      pluginApi.memory.set(baseRulesKey, baseRoot)
      pluginApi.addBase(baseRoot)
    }

    createUtilityPlugin(
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
      {
        resolveArbitraryValue: asLength,
        lolback(_value, { selector }) {
          if (pluginApi.config('mode') === 'jit') {
            addBaseSelector(pluginApi.memory, pluginApi.corePlugins, pluginApi.theme, selector)
          }
        },
      }
    )(pluginApi)
  }
}
