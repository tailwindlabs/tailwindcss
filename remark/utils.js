const syntaxTheme = require('../src/utils/syntaxTheme')
const dlv = require('dlv')
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

module.exports.highlightCode = function highlightCode(code, language) {
  let highlighted = Prism.languages[language]
    ? Prism.highlight(code, Prism.languages[language], language)
    : code

  highlighted = highlighted.replace(/class="token([^"]+)"/g, (_, p1) => {
    const types = p1.trim().split(/\s/)
    if (types.length === 0) return ''
    const classes = types
      .map((type) => dlv(syntaxTheme, [language, type], syntaxTheme[type]))
      .filter(Boolean)
    if (classes.length === 0) return ''
    return `class="${classes.join(' ')}"`
  })

  return language === 'html'
    ? highlighted.replace(
        /\*\*(.*?)\*\*/g,
        (_, text) => `<span class="code-highlight bg-code-highlight">${text}</span>`
      )
    : highlighted
}
