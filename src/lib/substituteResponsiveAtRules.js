import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'
import buildMediaQuery from '../util/buildMediaQuery'
import buildSelectorVariant from '../util/buildSelectorVariant'
import { tap } from '../util/tap'

function isLayer(node) {
  if (Array.isArray(node)) {
    return node.length === 1 && isLayer(node[0])
  }
  return node.type === 'atrule' && node.name === 'layer'
}

function layerNodes(nodes) {
  return isLayer(nodes) ? nodes[0].nodes : nodes
}

export default function (config) {
  return function (css) {
    // Wrap any `responsive` rules with a copy of their parent `layer` to
    // ensure the layer isn't lost when copying to the `screens` location.
    css.walkAtRules('layer', (layerAtRule) => {
      let layer = layerAtRule.params
      layerAtRule.walkAtRules('responsive', (responsiveAtRule) => {
        let nestedlayerAtRule = postcss.atRule({
          name: 'layer',
          params: layer,
        })
        nestedlayerAtRule.prepend(responsiveAtRule.nodes)
        responsiveAtRule.removeAll()
        responsiveAtRule.prepend(nestedlayerAtRule)
      })
    })

    let {
      theme: { screens },
      separator,
    } = config
    let responsiveRules = postcss.root()
    let finalRules = []

    css.walkAtRules('responsive', (atRule) => {
      let nodes = atRule.nodes
      responsiveRules.append(...cloneNodes(nodes))

      // If the parent is already a `layer` (this is true for anything coming from
      // a plugin, including core plugins) we don't want to create a double nested
      // layer, so only insert the layer children. If there is no parent layer,
      // preserve the layer information when inserting the nodes.
      if (isLayer(atRule.parent)) {
        atRule.before(layerNodes(nodes))
      } else {
        atRule.before(nodes)
      }
      atRule.remove()
    })

    for (let [screen, value] of Object.entries(screens ?? {})) {
      let mediaQuery = postcss.atRule({
        name: 'media',
        params: buildMediaQuery(value),
      })

      mediaQuery.append(
        tap(responsiveRules.clone(), (clonedRoot) => {
          clonedRoot.walkRules((rule) => {
            rule.selectors = rule.selectors.map((selector) =>
              buildSelectorVariant(selector, screen, separator, (message) => {
                throw rule.error(message)
              })
            )
          })
        })
      )

      finalRules.push(mediaQuery)
    }

    let hasScreenRules = finalRules.some((i) => i.nodes.length !== 0)

    css.walkAtRules('tailwind', (atRule) => {
      if (atRule.params !== 'screens') {
        return
      }

      if (hasScreenRules) {
        atRule.before(finalRules)
      }

      atRule.remove()
    })
  }
}
