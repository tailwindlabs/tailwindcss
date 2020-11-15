const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
loadLanguages()
require('./prism-diff-highlight')(Prism)

module.exports.addImport = function addImport(tree, mod, name) {
  tree.children.unshift({
    type: 'import',
    value: `import { ${name} as _${name} } from '${mod}'`,
  })
  return `_${name}`
}

module.exports.addDefaultImport = function addImport(tree, mod, name) {
  tree.children.unshift({
    type: 'import',
    value: `import _${name} from '${mod}'`,
  })
  return `_${name}`
}

module.exports.addExport = function addExport(tree, name, value) {
  tree.children.push({
    type: 'export',
    value: `export const ${name} = ${JSON.stringify(value)}`,
  })
}

module.exports.highlightCode = function highlightCode(code, prismLanguage) {
  const isDiff = prismLanguage.startsWith('diff-')
  const language = isDiff ? prismLanguage.substr(5) : prismLanguage
  let highlighted = Prism.highlight(
    code,
    Prism.languages[isDiff ? 'diff' : language],
    prismLanguage
  )

  return language === 'html'
    ? highlighted.replace(
        /\*\*(.*?)\*\*/g,
        (_, text) => `<span class="code-highlight bg-code-highlight">${text}</span>`
      )
    : highlighted
}
