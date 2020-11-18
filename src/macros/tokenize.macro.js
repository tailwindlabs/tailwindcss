const { createMacro } = require('babel-plugin-macros')
const Prism = require('prismjs')
const { parseExpression } = require('@babel/parser')
const generate = require('@babel/generator').default

module.exports = createMacro(tokenizeMacro)

function simplify(token) {
  if (typeof token === 'string') return token
  return [token.type, Array.isArray(token.content) ? token.content.map(simplify) : token.content]
}

function tokenizeMacro({ references, babel: { types: t } }) {
  if (references.default) {
    references.default.forEach(createTransform('tokens'))
  }
  if (references.tokenizeWithLines) {
    references.tokenizeWithLines.forEach(createTransform('lines'))
  }

  function createTransform(type) {
    return (path) => {
      const lang = path.parentPath.node.property.name

      const codeNode = path.parentPath.parentPath.node.arguments[0]
      const originalCode = t.isTemplateLiteral(codeNode)
        ? codeNode.quasis[0].value.cooked
        : codeNode.value

      const returnCodeNode = path.parentPath.parentPath.node.arguments[1]
      const returnCode = returnCodeNode && returnCodeNode.value

      const argsNode = path.parentPath.parentPath.node.arguments[3]
      let args = {}
      if (argsNode) {
        eval('args = ' + generate(argsNode).code)
      }

      const codeTransformerNode = path.parentPath.parentPath.node.arguments[2]
      let code = originalCode
      if (codeTransformerNode) {
        const codeTransformer = eval(generate(codeTransformerNode).code)
        code = codeTransformer(code, args)
      }

      const tokens = Prism.tokenize(code, Prism.languages[lang])

      path.parentPath.parentPath.replaceWith(
        parseExpression(
          JSON.stringify({
            ...(type === 'tokens' ? { tokens: tokens.map(simplify) } : {}),
            ...(type === 'lines' ? { lines: normalizeTokens(tokens) } : {}),
            ...(returnCode ? { code: returnCode === 'original' ? originalCode : code } : {}),
            ...args,
          })
        )
      )
    }
  }
}

// https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/utils/normalizeTokens.js

const newlineRe = /\r\n|\r|\n/

// Empty lines need to contain a single empty token, denoted with { empty: true }
function normalizeEmptyLines(line) {
  if (line.length === 0) {
    line.push({
      types: ['plain'],
      content: '',
      empty: true,
    })
  } else if (line.length === 1 && line[0].content === '') {
    line[0].empty = true
  }
}

function appendTypes(types, add) {
  const typesSize = types.length
  if (typesSize > 0 && types[typesSize - 1] === add) {
    return types
  }

  return types.concat(add)
}

// Takes an array of Prism's tokens and groups them by line, turning plain
// strings into tokens as well. Tokens can become recursive in some cases,
// which means that their types are concatenated. Plain-string tokens however
// are always of type "plain".
// This is not recursive to avoid exceeding the call-stack limit, since it's unclear
// how nested Prism's tokens can become
function normalizeTokens(tokens) {
  const typeArrStack = [[]]
  const tokenArrStack = [tokens]
  const tokenArrIndexStack = [0]
  const tokenArrSizeStack = [tokens.length]

  let i = 0
  let stackIndex = 0
  let currentLine = []

  const acc = [currentLine]

  while (stackIndex > -1) {
    while ((i = tokenArrIndexStack[stackIndex]++) < tokenArrSizeStack[stackIndex]) {
      let content
      let types = typeArrStack[stackIndex]

      const tokenArr = tokenArrStack[stackIndex]
      const token = tokenArr[i]

      // Determine content and append type to types if necessary
      if (typeof token === 'string') {
        types = stackIndex > 0 ? types : ['plain']
        content = token
      } else {
        types = appendTypes(types, token.type)
        if (token.alias) {
          types = appendTypes(types, token.alias)
        }

        content = token.content
      }

      // If token.content is an array, increase the stack depth and repeat this while-loop
      if (typeof content !== 'string') {
        stackIndex++
        typeArrStack.push(types)
        tokenArrStack.push(content)
        tokenArrIndexStack.push(0)
        tokenArrSizeStack.push(content.length)
        continue
      }

      // Split by newlines
      const splitByNewlines = content.split(newlineRe)
      const newlineCount = splitByNewlines.length

      currentLine.push({ types, content: splitByNewlines[0] })

      // Create a new line for each string on a new line
      for (let i = 1; i < newlineCount; i++) {
        normalizeEmptyLines(currentLine)
        acc.push((currentLine = []))
        currentLine.push({ types, content: splitByNewlines[i] })
      }
    }

    // Decreate the stack depth
    stackIndex--
    typeArrStack.pop()
    tokenArrStack.pop()
    tokenArrIndexStack.pop()
    tokenArrSizeStack.pop()
  }

  normalizeEmptyLines(currentLine)
  return acc
}
