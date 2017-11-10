import cloneNodes from '../util/cloneNodes'

export default function() {
  return function(css) {
    css.walkAtRules('important', atRule => {
      atRule.walkDecls(decl => (decl.important = true))
      atRule.before(cloneNodes(atRule.nodes))
      atRule.remove()
    })
  }
}
