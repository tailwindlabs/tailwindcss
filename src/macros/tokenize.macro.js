const { createMacro } = require('babel-plugin-macros')
const Prism = require('prismjs')
const { parseExpression } = require('@babel/parser')
const stringify = require('stringify-object')

module.exports = createMacro(tokenizeMacro)

function simplify(token) {
  if (typeof token === 'string') return token
  return [token.type, Array.isArray(token.content) ? token.content.map(simplify) : token.content]
}

function tokenizeMacro({ references, babel: { types: t } }) {
  references.default.forEach((path) => {
    const lang = path.parentPath.node.property.name

    const codeNode = path.parentPath.parentPath.node.arguments[0]
    const code = t.isTemplateLiteral(codeNode) ? codeNode.quasis[0].value.raw : codeNode.value

    const tokens = Prism.tokenize(code, Prism.languages[lang]).map(simplify)

    path.parentPath.parentPath.replaceWith(
      parseExpression(`{code:${JSON.stringify(code)},tokens:${stringify(tokens)}}`)
    )
  })
}
