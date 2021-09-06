import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
import { useMemo } from './useMemo'

let classNameParser = selectorParser((selectors) => {
  return selectors.first.filter(({ type }) => type === 'class').pop().value
})

let getClassNameFromSelector = useMemo(
  (selector) => classNameParser.transformSync(selector),
  (selector) => selector
)

export default function generateVariantFunction(generator, options = {}) {
  return {
    options,
    handler: (container, config) => {
      let cloned = postcss.root({ nodes: container.clone().nodes })

      container.before(
        (
          generator({
            container: cloned,
            separator: config.separator,
            modifySelectors: (modifierFunction) => {
              cloned.each((rule) => {
                if (rule.type !== 'rule') {
                  return
                }

                rule.selectors = rule.selectors.map((selector) => {
                  return modifierFunction({
                    get className() {
                      return getClassNameFromSelector(selector)
                    },
                    selector,
                  })
                })
              })
              return cloned
            },
          }) ?? cloned
        ).nodes
      )
    },
  }
}
