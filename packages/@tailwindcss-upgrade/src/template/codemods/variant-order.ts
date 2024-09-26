import { walk, type AstNode } from '../../../../tailwindcss/src/ast'
import type { Variant } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

export function variantOrder(designSystem: DesignSystem, rawCandidate: string): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.variants.length > 1) {
      // If the variant stack is made of only variants where the order does not
      // matter, we can skip the reordering
      if (candidate.variants.every((v) => isOrderIndependentVariant(designSystem, v))) {
        continue
      }

      let mediaVariants = []
      let regularVariants = []
      let pseudoElementVariants = []

      for (let variant of candidate.variants) {
        if (isMediaVariant(designSystem, variant)) {
          mediaVariants.push(variant)
        } else if (isEndOfSelectorPseudoElement(variant)) {
          pseudoElementVariants.push(variant)
        } else {
          regularVariants.push(variant)
        }
      }

      // The candidate list in the AST need to be in reverse order
      candidate.variants = [
        ...pseudoElementVariants.reverse(),
        ...regularVariants.reverse(),
        ...mediaVariants,
      ]
      return printCandidate(candidate)
    }
  }
  return rawCandidate
}

function isOrderIndependentVariant(designSystem: DesignSystem, variant: Variant) {
  let stack = getAppliedNodeStack(designSystem, variant)
    // Remove media variants from the stack, these are hoisted and don't affect the order of the
    // below pseudos
    .filter((node) => !(node.kind === 'rule' && node.selector.startsWith('@media (hover:')))
  return stack.every(
    (node) => node.kind === 'rule' && (node.selector === '&:hover' || node.selector === '&:focus'),
  )
}

function isMediaVariant(designSystem: DesignSystem, variant: Variant) {
  // Handle the dark variant as a media variant
  if (variant.kind === 'static' && variant.root === 'dark') {
    return true
  }
  let stack = getAppliedNodeStack(designSystem, variant)
  return stack.every((node) => node.kind === 'rule' && node.selector.startsWith('@media'))
}

function isEndOfSelectorPseudoElement(variant: Variant) {
  if (variant.kind !== 'static') {
    return false
  }
  switch (variant.root) {
    case 'after':
    case 'backdrop':
    case 'before':
    case 'first-letter':
    case 'first-line':
    case 'marker':
    case 'placeholder':
    case 'selection':
      return true
    default:
      return false
  }
}

function getAppliedNodeStack(designSystem: DesignSystem, variant: Variant): AstNode[] {
  let stack: AstNode[] = []
  let ast = designSystem
    .compileAstNodes({
      kind: 'arbitrary',
      property: 'color',
      value: 'red',
      modifier: null,
      variants: [variant],
      important: false,
      raw: 'candidate',
    })
    .map((c) => c.node)

  walk(ast, (node) => {
    // Ignore the variant root class
    if (node.kind === 'rule' && node.selector === '.candidate') {
      return
    }
    // Ignore the dummy declaration
    if (node.kind === 'declaration' && node.property === 'color' && node.value === 'red') {
      return
    }
    stack.push(node)
  })
  return stack
}
