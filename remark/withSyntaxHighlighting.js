const visit = require('unist-util-visit')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
loadLanguages()
require('./prism-diff-highlight')(Prism)

module.exports.withSyntaxHighlighting = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang !== null) {
        node.type = 'html'
        node.value = [
          `<pre class="language-${node.lang} ${node.meta || ''}">`,
          `<code class="language-${node.lang}">`,
          Prism.languages[node.lang]
            ? Prism.highlight(node.value, Prism.languages[node.lang], node.lang)
            : node.value,
          '</code>',
          '</pre>',
        ].join('')
      }
    })
  }
}
