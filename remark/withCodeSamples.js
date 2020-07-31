const visit = require('unist-util-visit')
const Prism = require('prismjs')
const redent = require('redent')
const { addImport } = require('./utils')

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

      snippet = Prism.highlight(redent(snippet).trim(), Prism.languages.html, 'html')

      node.type = 'jsx'
      node.value = `
        <${component}
          preview={${JSON.stringify(previewCode)}}
          snippet={${JSON.stringify(snippet)}}
          previewClassName={${JSON.stringify(previewClassName)}}
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
