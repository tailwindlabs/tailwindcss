import _ from 'lodash'
import postcss from 'postcss'

const hyph = s => s.replace(/[A-Z]|^ms/g, '-$&').toLowerCase()
const mx = (rule, media) => media ? `${media}{${rule}}` : rule
const noAnd = s => s.replace(/&/g, '')
const createDeclaration = (key, value) => hyph(key) + ':' + value
const createRule = ({
  className,
  child,
  media,
  declarations
}) => mx(`${className + child}{${declarations.join(';')}}`, media)

const parseRules = (obj, child = '', media) => {
  const rules = []
  const declarations = []

  for (let key in obj) {
    const value = obj[key]

    if (value === null) continue

    if (typeof value === 'object') {
      const _media = /^@/.test(key) ? key : null
      const _child = _media ? child : child + noAnd(key)
      parseRules(value, _child, _media)
        .forEach(r => rules.push(r))
      continue
    }

    const dec = createDeclaration(key, value)
    declarations.push(dec)
  }

  rules.unshift({
    media,
    child,
    declarations
  })

  return rules
}

const parse = (selector, obj) => {
  const rules = parseRules(obj)

  console.log(rules)

  return rules.map(rule => {
    const className = selector
    const ruleset = createRule(Object.assign(rule, { className }))
    return ruleset
  })
}

function parseObjectStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseObjectStyles([styles])
  }

  return _.flatMap(styles, (style) => {
    return _.flatMap(style, (declarations, selector) => {
      return parse(selector, declarations)
    })
  }).join('')
}

export default parseObjectStyles
