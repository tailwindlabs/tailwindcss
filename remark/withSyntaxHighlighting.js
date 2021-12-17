const { highlightCode, addImport } = require('./utils')

module.exports.withSyntaxHighlighting = () => {
  return (tree) => {
    let preTree = { children: [] }
    let componentName
    tree.children = tree.children.flatMap((node) => {
      if (node.type !== 'code') return node
      if (node.lang === null) return node

      let re = /(<[^>]+)\s+dark-([a-z-]+)="([^"]+)"([^>]*>)/gi

      let lightCode = node.value.replace(
        re,
        (_match, before, _key, _value, after) => `${before}${after}`
      )
      let darkCode = node.value.replace(re, (_match, before, key, value, after) =>
        `${before}${after}`.replace(new RegExp(`(\\s${key})="[^"]+"`), `$1="${value}"`)
      )

      node.type = 'html'

      if (lightCode === darkCode) {
        node.value = [
          `<pre class="language-${node.lang}">`,
          `<code class="language-${node.lang}">`,
          highlightCode(lightCode, node.lang),
          '</code>',
          '</pre>',
        ]
          .filter(Boolean)
          .join('')
      } else {
        node.value = [
          `<pre class="language-${node.lang}">`,
          `<code class="dark:hidden language-${node.lang}">`,
          highlightCode(lightCode, node.lang),
          '</code>',
          `<code class="hidden dark:block language-${node.lang}">`,
          highlightCode(darkCode, node.lang),
          '</code>',
          '</pre>',
        ]
          .filter(Boolean)
          .join('')
      }

      if (node.meta) {
        if (!componentName) {
          componentName = addImport(preTree, '@/components/Editor', 'Editor')
        }
        return [
          { type: 'jsx', value: `<${componentName} filename="${node.meta}">` },
          node,
          { type: 'jsx', value: `</${componentName}>` },
        ]
      }

      return node
    })
    tree.children = [...preTree.children, ...tree.children]
  }
}
