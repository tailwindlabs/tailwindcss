const visit = require('unist-util-visit')
const Prism = require('prismjs')

module.exports.withSyntaxHighlighting = () => {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (['html', 'css', 'javascript', 'js'].includes(node.lang)) {
        node.type = 'html'
        node.value = [
          `<pre class="language-${node.value}">`,
          `<code class="language-${node.value}">`,
          Prism.highlight(node.value, Prism.languages[node.lang], node.lang),
          '</code>',
          '</pre>',
        ].join('')
      }
    })
  }
}
