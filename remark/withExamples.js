const { addImport } = require('./utils')

module.exports = () => {
  return (tree) => {
    let preTree = { children: [] }
    let componentName

    tree.children = tree.children.map((node, index) => {
      // Start of horizontal block: -- block
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].value === '-- block'
      ) {
        node.type = 'jsx'
        node.value = `<div className='grid md:grid-cols-2 md:gap-8'><div>`
      }

      // Start a new column: -- column
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].value === '-- column'
      ) {
        node.type = 'jsx'
        node.value = `</div><div>`
      }

      // End of horizontal block: -- /block
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].value === '-- /block'
      ) {
        node.type = 'jsx'
        node.value = `</div></div>`
      }

      if (node.type === 'jsx') {
        let [, props = '', html] =
          node.value.trim().match(/^<Example(?:>|\s(.*?)>)(.*?)<\/Example>$/is) ?? []

        if (html) {
          let next = tree.children[index + 1]
          if (!componentName) {
            componentName = addImport(preTree, '@/components/Example', 'Example')
          }

          node.value = `<${componentName} ${props} containerClassName="${
            next?.type === 'code' ? 'mt-4 -mb-3' : 'my-6'
          }" html={${JSON.stringify(html)}} />`
        }
      }

      // if (node.type === 'code' && node.lang === 'html' && (node.meta ?? '').includes('example')) {
      //   let padding =
      //     node.meta
      //       .trim()
      //       .split(/\s+/)
      //       .filter((x) => x !== 'example')[0] ?? 'md'
      //   let paddingMap = { none: '', md: 'p-8' }
      //   if (paddingMap[padding] === undefined) throw Error(`Unknown padding value: ${padding}`)

      //   let next = tree.children[index + 1]
      //   node.type = 'html'
      //   node.value = [
      //     `<div class="${next?.type === 'code' ? 'mt-6 -mb-4' : 'my-6'} ${
      //       paddingMap[padding]
      //     } not-prose relative bg-grid bg-slate-50 border border-slate-200 rounded-lg overflow-hidden" style="background-size:2rem">`,
      //     '<div class="absolute inset-0 bg-gradient-to-b from-slate-50"></div>',
      //     '<div class="relative">',
      //     node.value,
      //     '</div>',
      //     '</div>',
      //   ].join('\n')
      // }

      return node
    })

    tree.children = [...preTree.children, ...tree.children]
  }
}
