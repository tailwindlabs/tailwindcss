const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
loadLanguages()
require('./prism-diff-highlight')(Prism)

const HTML_TAG = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/gi
const PSEUDO_CLASSES = [
  'active',
  'any-link',
  'blank',
  'checked',
  'current',
  'default',
  'defined',
  'dir',
  'disabled',
  'drop',
  'empty',
  'enabled',
  'first',
  'first-child',
  'first-of-type',
  'fullscreen',
  'future',
  'focus',
  'focus-visible',
  'focus-within',
  'has',
  'host',
  'host',
  'host-context',
  'hover',
  'indeterminate',
  'in-range',
  'invalid',
  'is',
  'lang',
  'last-child',
  'last-of-type',
  'left',
  'link',
  'local-link',
  'not',
  'nth-child',
  'nth-col',
  'nth-last-child',
  'nth-last-col',
  'nth-last-of-type',
  'nth-of-type',
  'only-child',
  'only-of-type',
  'optional',
  'out-of-range',
  'past',
  'picture-in-picture',
  'placeholder-shown',
  'read-only',
  'read-write',
  'required',
  'right',
  'root',
  'scope',
  'state',
  'target',
  'target-within',
  'user-invalid',
  'valid',
  'visited',
  'where',
]

Prism.hooks.add('wrap', (env) => {
  if (env.type === 'atrule') {
    const content = env.content.replace(HTML_TAG, '')
    if (content.startsWith('@apply')) {
      env.classes.push('atapply')
    }
  } else if (env.type === 'pseudo-class') {
    if (!new RegExp(`^::?(${PSEUDO_CLASSES.join('|')})`).test(env.content)) {
      env.classes = env.classes.filter((x) => x !== 'pseudo-class')
    }
  }
})

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
  const grammar = Prism.languages[isDiff ? 'diff' : language]
  if (!grammar) {
    console.warn(`Unrecognised language: ${prismLanguage}`)
    return Prism.util.encode(code)
  }
  let highlighted = Prism.highlight(code, grammar, prismLanguage)

  return language === 'html'
    ? highlighted.replace(
        /\*\*(.*?)\*\*/g,
        (_, text) => `<span class="code-highlight bg-code-highlight">${text}</span>`
      )
    : highlighted
}
