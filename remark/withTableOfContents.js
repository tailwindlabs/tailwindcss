const { addImport, addExport } = require('./utils')
const slugify = require('@sindresorhus/slugify')

module.exports.withTableOfContents = () => {
  return (tree) => {
    const component = addImport(tree, '@/components/Heading', 'Heading')
    const contents = []

    for (let nodeIndex = 0; nodeIndex < tree.children.length; nodeIndex++) {
      let node = tree.children[nodeIndex]

      if (node.type === 'heading' && [2, 3, 4].includes(node.depth)) {
        let level = node.depth
        let title = node.children
          .filter(
            (n, i, a) =>
              n.type === 'text' &&
              (a[i - 1]?.type !== 'jsx' || !a[i - 1]?.value.startsWith('<small'))
          )
          .map((n) => n.value)
          .join('')
        let slug = slugify(title)

        let allOtherSlugs = contents.flatMap((entry) => [
          entry.slug,
          ...entry.children.map(({ slug }) => slug),
        ])
        let slugIndex = 1
        while (allOtherSlugs.indexOf(slug) > -1) {
          slug = `${slugify(title)}-${slugIndex}`
          slugIndex++
        }

        node.type = 'jsx'

        let props = {
          level,
          id: slug,
        }

        if (tree.children[nodeIndex + 1]) {
          let { children, position, value, ...element } = tree.children[nodeIndex + 1]
          props.nextElement = element
        }

        if (node.children[0].type === 'jsx' && /^\s*<Heading[\s>]/.test(node.children[0].value)) {
          let value = node.children[0].value.replace(/toc="((?:[^"\\]|\\.)*)"/, (_, toc) => {
            title = toc
            slug = slugify(title)
            props.id = slug
            return ''
          })
          node.value =
            value.replace(/^\s*<Heading([\s>])/, `<Heading ${stringifyProps(props)}$1`) +
            node.children
              .slice(1)
              .map((n) => n.value)
              .join('')
        } else {
          node.value = `<${component} ${stringifyProps(props)}>${node.children
            .map(({ value }) => value)
            .join('')}</${component}>`
        }

        if (level === 2) {
          contents.push({ title, slug, children: [] })
        } else if (level === 3) {
          contents[contents.length - 1].children.push({ title, slug, children: [] })
        } else {
          contents[contents.length - 1].children[
            contents[contents.length - 1].children.length - 1
          ].children.push({ title, slug })
        }
      } else if (
        node.type === 'jsx' &&
        /^\s*<Heading[\s>]/.test(node.value) &&
        !/^\s*<Heading[^>]*\sid=/.test(node.value)
      ) {
        const title = node.value
          .replace(/<[^>]+>/g, '')
          .replace(/\{(["'])((?:(?=(\\?))\3.)*?)\1\}/g, '$2')
        node.value = node.value.replace(/^\s*<Heading([\s>])/, `<Heading id="${slugify(title)}"$1`)
      }
    }

    addExport(tree, 'tableOfContents', contents)
  }
}

function stringifyProps(props) {
  return Object.entries(props)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join(' ')
}
