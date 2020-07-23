const { addImport, addExport } = require('./utils')

module.exports.withTableOfContents = () => {
  return (tree) => {
    const component = addImport(tree, '@/components/Heading', 'Heading')
    const contents = []

    for (let i = 0; i < tree.children.length; i++) {
      let node = tree.children[i]

      if (node.type === 'heading' && [2, 3].includes(node.depth)) {
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

        if (node.children[0].type === 'jsx' && /^\s*<Heading[\s>]/.test(node.children[0].value)) {
          node.value =
            node.children[0].value.replace(
              /^\s*<Heading([\s>])/,
              `<Heading level={${level}} id="${slug}"$1`
            ) +
            node.children
              .slice(1)
              .map((n) => n.value)
              .join('')
        } else {
          node.value = `<${component} level={${level}} id="${slug}">${node.children
            .map(({ value }) => value)
            .join('')}</${component}>`
        }

        if (level === 2) {
          contents.push({ title, slug, children: [] })
        } else {
          contents[contents.length - 1].children.push({ title, slug })
        }
      }
    }

    addExport(tree, 'tableOfContents', contents)
  }
}
