import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'
import buildMediaQuery from '../util/buildMediaQuery'
import buildSelectorVariant from '../util/buildSelectorVariant'

function matchesBucket(atRule, bucket) {
  return (
    atRule.params === bucket ||
    (bucket === 'utilities' && (atRule.params === '' || atRule.params === undefined))
  )
}

function insertResponsiveRules(config, css, bucket) {
  const {
    theme: { screens },
    separator,
  } = config
  const responsiveRules = postcss.root()
  const finalRules = []

  css.walkAtRules('responsive', atRule => {
    if (matchesBucket(atRule, bucket)) {
      const nodes = atRule.nodes
      responsiveRules.append(...cloneNodes(nodes))
      atRule.before(nodes)
      atRule.remove()
    }
  })

  _.keys(screens).forEach(screen => {
    const mediaQuery = postcss.atRule({
      name: 'media',
      params: buildMediaQuery(screens[screen]),
    })

    mediaQuery.append(
      _.tap(responsiveRules.clone(), clonedRoot => {
        clonedRoot.walkRules(rule => {
          rule.selectors = _.map(rule.selectors, selector =>
            buildSelectorVariant(selector, screen, separator, message => {
              throw rule.error(message)
            })
          )
        })
      })
    )

    finalRules.push(mediaQuery)
  })

  const hasScreenRules = finalRules.some(i => i.nodes.length !== 0)

  css.walkAtRules('screens', atRule => {
    if (atRule.params !== bucket) {
      return
    }

    if (hasScreenRules) {
      atRule.before(finalRules)
    }

    atRule.remove()
  })
}

export default function(config) {
  return function(css) {
    insertResponsiveRules(config, css, 'components')
    insertResponsiveRules(config, css, 'utilities')
  }
}
