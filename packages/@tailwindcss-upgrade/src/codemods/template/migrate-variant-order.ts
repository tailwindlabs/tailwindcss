import { walk, type AstNode } from '../../../../tailwindcss/src/ast'
import { type Variant } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from './candidates'

export function migrateVariantOrder(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.variants.length <= 1) {
      continue
    }

    let atRuleVariants = []
    let regularVariants = []
    let pseudoElementVariants = []

    let originalOrder = candidate.variants

    for (let variant of candidate.variants) {
      if (isAtRuleVariant(designSystem, variant)) {
        atRuleVariants.push(variant)
      } else if (isEndOfSelectorPseudoElement(designSystem, variant)) {
        pseudoElementVariants.push(variant)
      } else {
        regularVariants.push(variant)
      }
    }

    // We only need to reorder regular variants if order is important
    let regularVariantsNeedReordering = regularVariants.some((v) =>
      isCombinatorVariant(designSystem, v),
    )

    // The candidate list in the AST need to be in reverse order
    let newOrder = [
      ...pseudoElementVariants,
      ...(regularVariantsNeedReordering ? regularVariants.reverse() : regularVariants),
      ...atRuleVariants,
    ]

    if (orderMatches(originalOrder, newOrder)) {
      continue
    }

    return printCandidate(designSystem, { ...candidate, variants: newOrder })
  }
  return rawCandidate
}

function isAtRuleVariant(designSystem: DesignSystem, variant: Variant) {
  // Handle the dark variant as an at-rule variant
  if (variant.kind === 'static' && variant.root === 'dark') {
    return true
  }
  let stack = getAppliedNodeStack(designSystem, variant)
  return stack.every((node) => node.kind === 'at-rule')
}

function isCombinatorVariant(designSystem: DesignSystem, variant: Variant) {
  let stack = getAppliedNodeStack(designSystem, variant)
  return stack.some(
    (node) =>
      node.kind === 'rule' &&
      // Combinators include any of the following characters
      (node.selector.includes(' ') ||
        node.selector.includes('>') ||
        node.selector.includes('+') ||
        node.selector.includes('~')),
  )
}

function isEndOfSelectorPseudoElement(designSystem: DesignSystem, variant: Variant) {
  let stack = getAppliedNodeStack(designSystem, variant)
  return stack.some(
    (node) =>
      node.kind === 'rule' &&
      (node.selector.includes('::after') ||
        node.selector.includes('::backdrop') ||
        node.selector.includes('::before') ||
        node.selector.includes('::first-letter') ||
        node.selector.includes('::first-line') ||
        node.selector.includes('::marker') ||
        node.selector.includes('::placeholder') ||
        node.selector.includes('::selection')),
  )
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

function orderMatches<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  return a.every((v, i) => b[i] === v)
}
