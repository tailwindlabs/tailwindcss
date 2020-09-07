import buildSelectorVariant from '../util/buildSelectorVariant'
import defaultConfig from '../../defaultConfig'

export default {
  dark: 'media',
  variants: {
    backgroundColor: [...defaultConfig.variants.backgroundColor, 'dark'],
    gradientColorStops: [...defaultConfig.variants.gradientColorStops, 'dark'],
    borderColor: [...defaultConfig.variants.borderColor, 'dark'],
    divideColor: [...defaultConfig.variants.divideColor, 'dark'],
    placeholderColor: [...defaultConfig.variants.placeholderColor, 'dark'],
    textColor: [...defaultConfig.variants.textColor, 'dark'],
  },
  plugins: [
    function({ addVariant, config, postcss, prefix }) {
      addVariant('dark', ({ container, separator, modifySelectors }) => {
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
              return `${prefix('.dark ')} ${selector}`
            })
          })

          return modified
        }

        throw new Error("The `dark` config option must be either 'media' or 'class'.")
      })
    },
  ],
}
