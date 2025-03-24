import postcss from 'postcss'

export default () => {
  return {
    postcssPlugin: '@tailwindcss/postcss-at-property-polyfill',
    Once(root: postcss.Root) {
      const propertyRules = new Map<string, postcss.AtRule>()
      const initialValues = new Map<string, string>()
      const nonInheritableValues = new Map<string, string>()

      // Collect @property rules
      root.walkAtRules('property', (rule: postcss.AtRule) => {
        const name = rule.params.trim()

        propertyRules.set(name, rule)

        let value: string | null = null
        rule.walkDecls('initial-value', (decl: postcss.Declaration) => {
          if (decl.value) {
            value = decl.value
          }
        })

        rule.walkDecls('inherits', (decl: postcss.Declaration) => {
          if (decl.value === 'false') {
            nonInheritableValues.set(name, value ? value : 'initial')
          }
        })

        if (value && !nonInheritableValues.has(name)) {
          initialValues.set(name, value)
        }

        rule.remove()
      })

      // Add initial values to :root in a layer
      if (initialValues.size > 0 || nonInheritableValues.size > 0) {
        const layer = postcss.atRule({
          name: 'layer',
          params: '',
        })

        if (initialValues.size > 0) {
          const rootRule = postcss.rule({
            selector: ':root',
          })

          for (const [name, value] of initialValues) {
            rootRule.append({
              prop: name,
              value: value,
            })
          }
          layer.append(rootRule)
        }

        if (nonInheritableValues.size > 0) {
          const rootRule = postcss.rule({
            selector: '*, *:before, *:after, *:backdrop',
          })

          for (const [name, value] of nonInheritableValues) {
            rootRule.append({
              prop: name,
              value: value,
            })
          }
          layer.append(rootRule)
        }

        root.prepend(layer)
      }
    },
  }
}

export const postcssPlugin = 'postcss-at-property-polyfill'
