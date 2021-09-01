let postcss = require('postcss')
let postcssNested = require('postcss-nested')

module.exports = function nesting(opts = postcssNested) {
  return (root, result) => {
    root.walkAtRules('screen', (rule) => {
      rule.name = 'media'
      rule.params = `screen(${rule.params})`
    })

    root.walkAtRules('apply', (rule) => {
      rule.before(postcss.decl({ prop: '__apply', value: rule.params, source: rule.source }))
      rule.remove()
    })

    let plugin = (() => {
      if (typeof opts === 'function') {
        return opts
      }

      if (typeof opts === 'string') {
        return require(opts)
      }

      if (Object.keys(opts).length <= 0) {
        return postcssNested
      }

      throw new Error('tailwindcss/nesting should be loaded with a nesting plugin.')
    })()

    postcss([plugin]).process(root, result.opts).sync()

    root.walkDecls('__apply', (decl) => {
      decl.before(postcss.atRule({ name: 'apply', params: decl.value, source: decl.source }))
      decl.remove()
    })

    return root
  }
}
