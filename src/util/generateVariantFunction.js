import escapeClassName from './escapeClassName'

export default function generateVariantFunction(generator) {
  return (container, config) => {
    const cloned = container.clone()

    cloned.walkRules(rule => {
      rule.selector = generator({
        className: rule.selector.slice(1),
        separator: escapeClassName(config.options.separator),
      })
    })

    container.before(cloned.nodes)
  }
}
