import _ from 'lodash'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

export default generator => (container, config) => {
  const cloned = postcss.root({ nodes: container.clone().nodes })

  container.before(
    _.defaultTo(
      generator({
        container: cloned,
        separator: config.separator,
        modifySelectors: modifierFunction => {
          cloned.walkRules(rule => {
            rule.selectors = rule.selectors.map(selector => {
              const className = selectorParser(
                selectors => selectors.first.filter(({ type }) => type === 'class').pop().value
              ).transformSync(selector)

              return modifierFunction({
                className,
                selector,
              })
            })
          })

          return cloned
        },
      }),
      cloned
    ).nodes
  )
}
