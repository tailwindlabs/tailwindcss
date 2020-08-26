// @preval
const { defaultConfig } = require('./defaultConfig')
const Prism = require('prismjs')
const stringify = require('stringify-object')

module.exports.defaultVariantsConfig = Prism.highlight(
  `// Default configuration
module.exports = {
  // ...
  variants: {
    ${Object.keys(defaultConfig.variants)
      .map(
        (variant) =>
          `${variant}: ${stringify(defaultConfig.variants[variant], {
            inlineCharacterLimit: Infinity,
          })}`
      )
      .join(',\n    ')}
  }
}`,
  Prism.languages.js,
  'js'
)
