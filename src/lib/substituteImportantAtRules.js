import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from '../util/cloneNodes'

export default function(config) {
  return function (css) {
    const options = config()

    css.walkAtRules('important', atRule => {
      atRule.walkDecls(decl => decl.important = true)
      atRule.before(cloneNodes(atRule.nodes))
      atRule.remove()
    })
  }
}
