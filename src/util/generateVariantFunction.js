import _ from 'lodash'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

const classNameParser = selectorParser(selectors => {
  return selectors.first.filter(({ type }) => type === 'class').pop().value
})

export default function generateVariantFunction(generator) {
  return (container, config) => {
    const cloned = postcss.root({ nodes: container.clone().nodes })

    container.before(
      _.defaultTo(
        generator({
          container: cloned,
          separator: config.separator,
          modifySelectors: modifierFunction => {
            cloned.each(rule => {
              if (rule.type !== 'rule') {
                return
              }

              rule.selectors = rule.selectors.map(selector => {
                return modifierFunction({
                  get className() {
                    return classNameParser.transformSync(selector)
                  },
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
}
