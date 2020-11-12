const visit = require('unist-util-visit')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
loadLanguages()
require('./prism-diff-highlight')(Prism)

const colors = {
  rose: 'bg-rose-400',
}

module.exports.withSyntaxHighlighting = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang !== null) {
        node.type = 'html'
        node.value = [
          `<div class="my-6 rounded-xl overflow-hidden ${colors[node.meta] || 'bg-gray-800'}">`,
          `<pre class="language-${node.lang} ${
            colors[node.meta] ? 'bg-black bg-opacity-75' : ''
          }">`,
          `<code class="language-${node.lang}">`,
          Prism.languages[node.lang]
            ? Prism.highlight(node.value, Prism.languages[node.lang], node.lang)
            : node.value,
          '</code>',
          '</pre>',
          '</div>',
        ]
          .filter(Boolean)
          .join('')
      }
    })
  }
}
