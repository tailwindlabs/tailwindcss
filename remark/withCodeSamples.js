const visit = require('unist-util-visit')
const redent = require('redent')
const { addImport, highlightCode } = require('./utils')

module.exports = () => {
  return (tree) => {
    let component
    let resizableComponent

    visit(tree, 'code', (node) => {
      if (node.lang !== 'html') return
      let hasPreview = false
      let previewClassName
      let previewCode
      let previewSrc
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
      if (!hasPreview) {
        snippet = node.value
          .replace(
            /<iframe\s+(?:src="([^"]*)"\s+)?preview(?:\s+src="([^"]*)")?>\s*<\/iframe>/is,
            (m, src1, src2) => {
              hasPreview = true
              previewSrc = src1 || src2
              return ''
            }
          )
          .trim()
      }
      if (!hasPreview) return
      if (!snippet) snippet = previewCode

      snippet = highlightCode(redent(snippet).trim(), 'html')

      const meta = node.meta ? node.meta.trim().split(/\s+/) : []
      const resizable = meta.find((x) => /^resizable(:|$)/.test(x))
      const color = meta.find((x) => !/^resizable(:|$)/.test(x))

      if (resizable && !resizableComponent) {
        resizableComponent = addImport(tree, '@/components/CodeSample', 'ResizableCodeSample')
      } else if (!resizable && !component) {
        component = addImport(tree, '@/components/CodeSample', 'CodeSample')
      }

      node.type = 'jsx'
      node.value = `
        <${resizable ? resizableComponent : component}
          preview={${JSON.stringify(previewCode)}}
          src={${JSON.stringify(previewSrc)}}
          snippet={${JSON.stringify(snippet)}}
          previewClassName={${JSON.stringify(previewClassName)}}
          color={${JSON.stringify(color)}}
          min={${JSON.stringify(resizable === 'resizable:min')}}
        />
      `.trim()
    })
  }
}
