import { walk, walkDepth, type AstNode, type Rule } from '../ast'
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
  // - Declarations must be sorted before nested rules:
  // https://www.w3.org/TR/css-nesting-1/#mixing
  //
  // - Selectors have their implicit `&` inserted to make selector manipulation
  // simpler in future steps.
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
    // This is done early to help reduce memory usage of repeated selectors
    // https://www.w3.org/TR/css-nesting-1/#example-31845edf
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

    // Step 2: Wrap selector lists in `:is()` when there are multiple selectors
    if (!node.selector.startsWith('@')) {
      node.selector =
        segment(node.selector, ',').length > 1 ? `:is(${node.selector})` : node.selector
    }

    // Step 3: Split rules from declarations
    // This will simplify the tree-flattening in the next step
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

    // There's exactly one nested rule so there's nothing for us to do
    if (rules.length === 1 && other.length === 0) return

    // 1. Replace the children in the current node with just the declarations
    let replacements: AstNode[] = []

    if (other.length > 0) {
      node.nodes = other
      replacements.push(node)
    }

    // 2. Insert the nested rules as siblings after the current node
    // while also wrapping each rule in a copy of the current rule
    for (let rule of rules) {
      let clone = structuredClone(node)
      clone.nodes = [rule]
      replacements.push(clone)
    }

    replaceWith(replacements)
  })

  // Step 2: De-nest rules by:
  // - Moving at rules up one level
  // - Merging selectors with `&` in them
  walk(ast, (node, { replaceWith }) => {
    if (node.kind !== 'rule') return
    if (node.nodes.length === 0) return
    if (node.selector.startsWith('@')) return

    // At this point it's guaranteed that a rule has either
    // multiple declarations in it _or_ a single rule
    // We want to skip if there's only declarations
    if (node.nodes[0].kind === 'declaration') return

    let child = node.nodes[0]
    if (child.kind !== 'rule') return
    if (child.selector[0] === '@') {
      let isNestable = nestableAtRules.some((atRule) => child.selector.startsWith(atRule))
      if (!isNestable) return

      node.nodes = child.nodes

      // this is an at-rule inside of a style rule
      let cloned = structuredClone(child)
      cloned.nodes = [node]

      replaceWith(cloned)

      return
    }

    child.selector = segment(child.selector, ',')
      .map((s) => s.replaceAll('&', node.selector))
      .join(',')

    replaceWith(child)
  })

  return ast
}
