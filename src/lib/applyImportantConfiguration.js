export default function applyImportantConfiguration(_config) {
  return function(css) {
    css.walkRules(rule => {
      const important = rule.__tailwind ? rule.__tailwind.important : false

      if (!important) {
        return
      }

      if (typeof important === 'string') {
        rule.selectors = rule.selectors.map(selector => {
          return `${rule.__tailwind.important} ${selector}`
        })
      } else {
        rule.walkDecls(decl => (decl.important = true))
      }
    })
  }
}
