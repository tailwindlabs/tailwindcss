import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from './escapeClassName'

export default function generateVariantFunction(generator) {
  return (container, config) => {
    const cloned = postcss.root({ nodes: container.clone().nodes })

    container.before(
      _.defaultTo(
        generator({
          container: cloned,
          separator: escapeClassName(config.options.separator),
          modifySelectors: modifierFunction => {
            cloned.walkRules(rule => {
              rule.selectors = rule.selectors.map(selector =>
                modifierFunction({
                  className: selector.slice(1),
                  selector,
                })
              )
            })
            return cloned
          },
        }),
        cloned
      ).nodes
    )
  }
}
