let nesting = require('./plugin')

module.exports = (opts) => {
  return {
    postcssPlugin: 'tailwindcss/nesting',
    Once(root, { result }) {
      return nesting(opts)(root, result)
    },
  }
}

module.exports.postcss = true
