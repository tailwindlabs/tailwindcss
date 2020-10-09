import buildSelectorVariant from '../util/buildSelectorVariant'

export default function({ addVariant, config, postcss, prefix }) {
  addVariant(
    'dark',
    ({ container, separator, modifySelectors }) => {
      if (config('dark') === false) {
        return postcss.root()
      }

      if (config('dark') === 'media') {
        const modified = modifySelectors(({ selector }) => {
          return buildSelectorVariant(selector, 'dark', separator, message => {
            throw container.error(message)
          })
        })
        const mediaQuery = postcss.atRule({
          name: 'media',
          params: '(prefers-color-scheme: dark)',
        })
        mediaQuery.append(modified)
        container.append(mediaQuery)
        return container
      }

      if (config('dark') === 'class') {
        const modified = modifySelectors(({ selector }) => {
          return buildSelectorVariant(selector, 'dark', separator, message => {
            throw container.error(message)
          })
        })

        modified.walkRules(rule => {
          rule.selectors = rule.selectors.map(selector => {
            return `${prefix('.dark')} ${selector}`
          })
        })

        return modified
      }

      throw new Error("The `dark` config option must be either 'media' or 'class'.")
    },
    { unstable_stack: true }
  )
}
