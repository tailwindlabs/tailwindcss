const visit = require('unist-util-visit')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
loadLanguages(['diff'])
require('./prism-diff-highlight')(Prism)

module.exports.withSyntaxHighlighting = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang !== null) {
        node.type = 'html'
        node.value = [
          `<pre class="language-${node.lang}">`,
          `<code class="language-${node.lang}">`,
          Prism.highlight(node.value, Prism.languages[node.lang], node.lang),
          '</code>',
          '</pre>',
        ].join('')
      }
    })
  }
}
