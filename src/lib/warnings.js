import parser from 'postcss-selector-parser'
import log from '../util/log.js'

let selectorExtractor = parser()

/**
 * @param {import('postcss').Node} rule
 */
function extractSelectors(node) {
  let rules = []

  if (node.type === 'rule') {
    rules.push(node)
  } else {
    node.walkRules((rule) => rules.push(rule))
  }

  let selectors = []

  for (const rule of rules) {
    for (let sel of selectorExtractor.astSync(rule.selector).nodes) {
      selectors.push(sel)
    }
  }

  return parser.root({
    nodes: selectors,
  })
}

/**
 *
 * @param {[meta: any, rule: any][]} matches
 * @returns {string|null}
 */
function strictUtilityWarnings(matches) {
  // We do this because `.foo .foo` produces two matches pointing to the same rule
  // We want the error message to be more specific so we remove duplicates
  let rules = Array.from(new Set(matches.map((rule) => rule[1])))

  if (rules.length === 0) {
    return
  }

  if (rules.length > 1) {
    return 'deprecation: found-multiple-rules'
  }

  let ast = extractSelectors(rules[0])

  if (ast.length > 1) {
    return 'deprecation: rule-contains-multiple-selectors'
  }

  let classCount = 0
  ast.walkClasses(() => {
    classCount += 1
  })

  if (classCount > 1) {
    return 'deprecation: rule-contains-multiple-classes'
  }
}

/**
 *
 * @param {string} source
 * @param {[meta: any, rule: any][]} matches
 * @param {import('postcss').Result} [result]
 * @param {import('postcss').Node} [node]
 */
export function showStrictWarningsFor(source, matches, result = null, node = null) {
  let message = strictUtilityWarnings(matches)

  if (message === undefined) {
    return
  }

  if (result && node) {
    node.warn(result, message)
  } else {
    log.warn(message, message)
  }
}
