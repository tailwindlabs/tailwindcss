import { rule, walk, walkDepth, type AstNode, type Rule } from '../ast'
import { segment } from '../utils/segment'

let nestableAtRules = [
  '@container',
  '@supports',
  '@media',
  '@layer',
  '@starting-style',
  '@document',
]

export function flattenNesting(ast: AstNode[]) {
  // Step 1: Sorting and selector preparation
  //
  // - Selectors have their implicit `&` inserted to make selector manipulation
  // simpler in future steps.
  //
  // - Declarations must be sorted before nested rules:
  // https://www.w3.org/TR/css-nesting-1/#mixing
  //
  // - Rules are split into multiple groups such that each group has either
  // a list of declarations OR at most one rule inside. This means the split
  // is done all the way to the root of the AST.
  //
  // We traverse from the inside out to ensure that AST modifications are
  // minimized and easier to reason about.
  walkDepth(ast, (node, { parent, replaceWith }) => {
    if (node.kind !== 'rule') return

    // Step 1: Add implicit `&` to all nested selectors
    if (parent && !node.selector.startsWith('@')) {
      let selectors = segment(node.selector, ',')

      for (let i = 0; i < selectors.length; i++) {
        let selector = selectors[i].trim()

        // Selectors that are relative *always* need to be prefixed with `&`
        // As do selectors that do not contain `&`
        if (
          selector.startsWith('+') ||
          selector.startsWith('~') ||
          selector.startsWith('>') ||
          !selector.includes('&')
        ) {
          selectors[i] = `& ${selector}`
        }
      }

      node.selector = selectors.join(', ')
    }

    // Step 2: Split rules from declarations
    // This will simplify the tree-flattening later
    let rules: Rule[] = []
    let other: AstNode[] = []

    for (let child of node.nodes) {
      if (child.kind !== 'rule') {
        other.push(child)
      } else {
        rules.push(child)
      }
    }

    // We need at least two nested
    if (rules.length === 0) return

    let replacements: AstNode[] = []

    // Add declarations in a separate rule node
    if (other.length > 0) {
      replacements.push(rule(node.selector, other))
    }

    // Add each nested rule in a separate rule node
    for (let r of rules) {
      replacements.push(rule(node.selector, [r]))
    }

    replaceWith(replacements)
  })

  // Step 2: Merge selectors of style rules
  // This technically produces invalid intermediate CSS but that gets flattened
  // out in the next step
  walkDepth(ast, (node, { path }) => {
    if (node.kind !== 'rule') return
    if (node.selector.startsWith('@')) return

    for (let ancestor of path.slice(1)) {
      if (ancestor.kind !== 'rule') continue
      if (ancestor.selector.startsWith('@')) continue

      let parentSelector =
        segment(ancestor.selector, ',').length > 1 ? `:is(${ancestor.selector})` : ancestor.selector

      node.selector = node.selector.replaceAll('&', parentSelector)
    }
  })

  // Step 3: Flatten nested style rules
  walk(ast, (node, { replaceWith }) => {
    if (node.kind !== 'rule') return
    if (node.selector[0] === '@') return
    if (node.nodes.length !== 1) return

    let child = node.nodes[0]

    // At this point it's guaranteed that a rule has either
    // multiple declarations in it _or_ a single rule
    // We want to skip if there's only declarations
    if (child.kind !== 'rule') return

    if (child.selector[0] === '@') {
      let isNestable = nestableAtRules.some((atRule) => (child as Rule).selector.startsWith(atRule))
      if (!isNestable) return

      child = rule(child.selector, [rule(node.selector, child.nodes)])
    }

    replaceWith(child)
  })

  return ast
}
