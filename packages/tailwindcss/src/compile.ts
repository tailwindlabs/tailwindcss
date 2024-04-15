import { rule, type AstNode, type Rule } from './ast'
import { type Candidate, type Variant } from './candidate'
import { type DesignSystem } from './design-system'
import GLOBAL_PROPERTY_ORDER from './property-order'
import { compare } from './utils/compare'
import { escape } from './utils/escape'
import type { Variants } from './variants'

export function compileCandidates(
  rawCandidates: Iterable<string>,
  designSystem: DesignSystem,
  { onInvalidCandidate }: { onInvalidCandidate?: (candidate: string) => void } = {},
) {
  let nodeSorting = new Map<
    AstNode,
    { properties: number[]; variants: bigint; candidate: string }
  >()
  let astNodes: AstNode[] = []
  let candidates = new Map<Candidate, string>()

  // Parse candidates and variants
  for (let rawCandidate of rawCandidates) {
    let candidate = designSystem.parseCandidate(rawCandidate)
    if (candidate === null) {
      onInvalidCandidate?.(rawCandidate)
      continue // Bail, invalid candidate
    }
    candidates.set(candidate, rawCandidate)
  }

  // Sort the variants
  let variants = designSystem.getUsedVariants().sort((a, z) => {
    return designSystem.variants.compare(a, z)
  })

  // Create the AST
  next: for (let [candidate, rawCandidate] of candidates) {
    let astNode = designSystem.compileAstNodes(rawCandidate)
    if (astNode === null) {
      onInvalidCandidate?.(rawCandidate)
      continue next
    }

    let { node, propertySort } = astNode

    // Track the variant order which is a number with each bit representing a
    // variant. This allows us to sort the rules based on the order of
    // variants used.
    let variantOrder = 0n
    for (let variant of candidate.variants) {
      variantOrder |= 1n << BigInt(variants.indexOf(variant))
    }

    nodeSorting.set(node, {
      properties: propertySort,
      variants: variantOrder,
      candidate: rawCandidate,
    })
    astNodes.push(node)
  }

  astNodes.sort((a, z) => {
    // Safety: At this point it is safe to use TypeScript's non-null assertion
    // operator because if the ast nodes didn't exist, we introduced a bug
    // above, but there is no need to re-check just to be sure. If this relied
    // on pure user input, then we would need to check for its existence.
    let aSorting = nodeSorting.get(a)!
    let zSorting = nodeSorting.get(z)!

    // Sort by variant order first
    if (aSorting.variants - zSorting.variants !== 0n) {
      return Number(aSorting.variants - zSorting.variants)
    }

    // Find the first property that is different between the two rules
    let offset = 0
    while (
      aSorting.properties.length < offset &&
      zSorting.properties.length < offset &&
      aSorting.properties[offset] === zSorting.properties[offset]
    ) {
      offset += 1
    }

    return (
      // Sort by lowest property index first
      (aSorting.properties[offset] ?? Infinity) - (zSorting.properties[offset] ?? Infinity) ||
      // Sort by most properties first, then by least properties
      zSorting.properties.length - aSorting.properties.length ||
      // Sort alphabetically
      compare(aSorting.candidate, zSorting.candidate)
    )
  })

  return {
    astNodes,
    nodeSorting,
  }
}

export function compileAstNodes(rawCandidate: string, designSystem: DesignSystem) {
  let candidate = designSystem.parseCandidate(rawCandidate)
  if (candidate === null) return null

  let nodes: AstNode[] = []

  // Handle arbitrary properties
  if (candidate.kind === 'arbitrary') {
    let compileFn = designSystem.utilities.getArbitrary()

    // Build the node
    let compiledNodes = compileFn(candidate)
    if (compiledNodes === undefined) return null

    nodes = compiledNodes
  }

  // Handle named utilities
  else if (candidate.kind === 'static' || candidate.kind === 'functional') {
    // Safety: At this point it is safe to use TypeScript's non-null assertion
    // operator because if the `candidate.root` didn't exist, `parseCandidate`
    // would have returned `null` and we would have returned early resulting
    // in not hitting this code path.
    let { compileFn } = designSystem.utilities.get(candidate.root)!

    // Build the node
    let compiledNodes = compileFn(candidate)
    if (compiledNodes === undefined) return null

    nodes = compiledNodes
  }

  let propertySort = getPropertySort(nodes)

  if (candidate.important) {
    applyImportant(nodes)
  }

  let node: Rule = {
    kind: 'rule',
    selector: `.${escape(rawCandidate)}`,
    nodes,
  }

  for (let variant of candidate.variants) {
    let result = applyVariant(node, variant, designSystem.variants)

    // When the variant results in `null`, it means that the variant cannot be
    // applied to the rule. Discard the candidate and continue to the next
    // one.
    if (result === null) return null
  }

  return {
    node,
    propertySort,
  }
}

export function applyVariant(node: Rule, variant: Variant, variants: Variants): null | void {
  if (variant.kind === 'arbitrary') {
    node.nodes = [rule(variant.selector, node.nodes)]
    return
  }

  // Safety: At this point it is safe to use TypeScript's non-null assertion
  // operator because if the `candidate.root` didn't exist, `parseCandidate`
  // would have returned `null` and we would have returned early resulting in
  // not hitting this code path.
  let { applyFn } = variants.get(variant.root)!

  if (variant.kind === 'compound') {
    let result = applyVariant(node, variant.variant, variants)
    if (result === null) return null

    for (let child of node.nodes) {
      // Only some variants wrap children in rules. For example, the `force`
      // variant is a noop on the AST. And the `has` variant modifies the
      // selector rather than the children.
      //
      // This means `child` may be a declaration and we don't want to apply the
      // variant to it. This also means the entire variant as a whole is not
      // applicable to the rule and should generate nothing.
      if (child.kind !== 'rule') return null

      let result = applyFn(child as Rule, variant)
      if (result === null) return null
    }
    return
  }

  // All other variants
  let result = applyFn(node, variant)
  if (result === null) return null
}

function applyImportant(ast: AstNode[]): void {
  for (let node of ast) {
    // Skip any `@at-root` rules — we don't want to make the contents of things
    // like `@keyframes` or `@property` important.
    if (node.kind === 'rule' && node.selector === '@at-root') {
      continue
    }

    if (node.kind === 'declaration') {
      node.important = true
    } else if (node.kind === 'rule') {
      applyImportant(node.nodes)
    }
  }
}

function getPropertySort(nodes: AstNode[]) {
  // Determine sort order based on properties used
  let propertySort = new Set<number>()
  let q: AstNode[] = nodes.slice()

  while (q.length > 0) {
    // Safety: At this point it is safe to use TypeScript's non-null assertion
    // operator because we guarded against `q.length > 0` above.
    let node = q.shift()!
    if (node.kind === 'declaration') {
      if (node.property === '--tw-sort') {
        let idx = GLOBAL_PROPERTY_ORDER.indexOf(node.value)
        if (idx !== -1) {
          propertySort.add(idx)
          break
        }
      }

      let idx = GLOBAL_PROPERTY_ORDER.indexOf(node.property)
      if (idx !== -1) propertySort.add(idx)
    } else if (node.kind === 'rule') {
      // Don't consider properties within `@at-root` when determining the sort
      // order for a rule.
      if (node.selector === '@at-root') continue

      for (let child of node.nodes) {
        q.push(child)
      }
    }
  }

  return Array.from(propertySort).sort((a, z) => a - z)
}
