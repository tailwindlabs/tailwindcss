const visit = require('unist-util-visit')
const redent = require('redent')
const { addImport, highlightCode } = require('./utils')

module.exports = () => {
  return (tree) => {
    let hasCodeSample = false
    let component = addImport(tree, '@/components/CodeSample', 'CodeSample')

    visit(tree, 'code', (node) => {
      if (node.lang !== 'html') return
      let hasPreview = false
      let previewClassName
      let previewCode
      let snippet = node.value
        .replace(
          /<template\s+(?:class="([^"]*)"\s+)?preview(?:\s+class="([^"]*)")?>(.*?)<\/template>/is,
          (m, class1, class2, content) => {
            hasPreview = true
            previewClassName = class1 || class2
            previewCode = content
            return ''
          }
        )
        .trim()
      if (!hasPreview) return
      if (!snippet) snippet = previewCode

      snippet = highlightCode(redent(snippet).trim(), 'html')

      node.type = 'jsx'
      node.value = `
        <${component}
          preview={${JSON.stringify(previewCode)}}
          snippet={${JSON.stringify(snippet)}}
          previewClassName={${JSON.stringify(previewClassName)}}
          color={${JSON.stringify(node.meta ? node.meta : undefined)}}
        />
      `.trim()

      hasCodeSample = true
    })

    if (!hasCodeSample) {
      // remove import
      tree.children.shift()
    }
  }
}
