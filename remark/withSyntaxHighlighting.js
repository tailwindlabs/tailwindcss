const visit = require('unist-util-visit')
const { highlightCode } = require('./utils')

const colors = {
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  fuchsia: 'bg-fuchsia-400',
  indigo: 'bg-indigo-400',
  lightBlue: 'bg-light-blue-500',
  purple: 'bg-purple-400',
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
          highlightCode(node.value, node.lang),
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
