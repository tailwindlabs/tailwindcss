const { addImport, addExport } = require('./utils')

module.exports.withTableOfContents = () => {
  return (tree) => {
    const component = addImport(tree, '@/components/Heading', 'Heading')
    const contents = []

    for (let i = 0; i < tree.children.length; i++) {
      let node = tree.children[i]

      if (node.type === 'heading') {
        const level = node.depth
        const title = node.children
          .filter((n) => n.type === 'text')
          .map((n) => n.value)
          .join('')
        const slug = title
          .replace(/\s+/g, '-')
          .replace(/[^a-z-]/gi, '')
          .replace(/-+/, '-')
          .toLowerCase()
        node.type = 'jsx'
        node.value = `<${component} level={${level}} id="${slug}">${node.children
          .map(({ value }) => value)
          .join('')}</${component}>`

        if (level === 2) {
          contents.push({ title, slug, children: [] })
        } else if (level === 3) {
          contents[contents.length - 1].children.push({ title, slug })
        }
      }
    }

    addExport(tree, 'tableOfContents', contents)
  }
}
