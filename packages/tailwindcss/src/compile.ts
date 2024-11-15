import {
  atRule,
  decl,
  rule,
  walk,
  WalkAction,
  type AstNode,
  type Rule,
  type StyleRule,
} from './ast'
import { type Candidate, type Variant } from './candidate'
import { substituteFunctions } from './css-functions'
import { type DesignSystem } from './design-system'
import GLOBAL_PROPERTY_ORDER from './property-order'
import { asColor, type Utility } from './utilities'
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
  let matches = new Map<string, Candidate[]>()

  // Parse candidates and variants
  for (let rawCandidate of rawCandidates) {
    if (designSystem.invalidCandidates.has(rawCandidate)) {
      onInvalidCandidate?.(rawCandidate)
      continue // Bail, invalid candidate
    }

    let candidates = designSystem.parseCandidate(rawCandidate)
    if (candidates.length === 0) {
      onInvalidCandidate?.(rawCandidate)
      continue // Bail, invalid candidate
    }

    matches.set(rawCandidate, candidates)
  }

  let variantOrderMap = designSystem.getVariantOrder()

  // Create the AST
  for (let [rawCandidate, candidates] of matches) {
    let found = false

    for (let candidate of candidates) {
      let rules = designSystem.compileAstNodes(candidate)
      if (rules.length === 0) continue

      // Arbitrary values (`text-[theme(--color-red-500)]`) and arbitrary
      // properties (`[--my-var:theme(--color-red-500)]`) can contain function
      // calls so we need evaluate any functions we find there that weren't in
      // the source CSS.
      try {
        substituteFunctions(
          rules.map(({ node }) => node),
          designSystem.resolveThemeValue,
        )
      } catch (err) {
        // If substitution fails then the candidate likely contains a call to
        // `theme()` that is invalid which may be because of incorrect usage,
        // invalid arguments, or a theme key that does not exist.
        continue
      }

      found = true

      for (let { node, propertySort } of rules) {
        // Track the variant order which is a number with each bit representing a
        // variant. This allows us to sort the rules based on the order of
        // variants used.
        let variantOrder = 0n
        for (let variant of candidate.variants) {
          variantOrder |= 1n << BigInt(variantOrderMap.get(variant)!)
        }

        nodeSorting.set(node, {
          properties: propertySort,
          variants: variantOrder,
          candidate: rawCandidate,
        })
        astNodes.push(node)
      }
    }

    if (!found) {
      onInvalidCandidate?.(rawCandidate)
    }
  }

  astNodes.sort((a, z) => {
    // SAFETY: At this point it is safe to use TypeScript's non-null assertion
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

export function compileAstNodes(candidate: Candidate, designSystem: DesignSystem) {
  let asts = compileBaseUtility(candidate, designSystem)
  if (asts.length === 0) return []

  let rules: {
    node: AstNode
    propertySort: number[]
  }[] = []

  let selector = `.${escape(candidate.raw)}`

  for (let nodes of asts) {
    let propertySort = getPropertySort(nodes)

    if (candidate.important || designSystem.important) {
      applyImportant(nodes)
    }

    let node: StyleRule = {
      kind: 'rule',
      selector,
      nodes,
    }

    for (let variant of candidate.variants) {
      let result = applyVariant(node, variant, designSystem.variants)

      // When the variant results in `null`, it means that the variant cannot be
      // applied to the rule. Discard the candidate and continue to the next
      // one.
      if (result === null) return []
    }

    rules.push({
      node,
      propertySort,
    })
  }

  return rules
}

export function applyVariant(
  node: Rule,
  variant: Variant,
  variants: Variants,
  depth: number = 0,
): null | void {
  if (variant.kind === 'arbitrary') {
    // Relative selectors are not valid as an entire arbitrary variant, only as
    // an arbitrary variant that is part of another compound variant.
    //
    // E.g. `[>img]:flex` is not valid, but `has-[>img]:flex` is
    if (variant.relative && depth === 0) return null

    node.nodes = [rule(variant.selector, node.nodes)]
    return
  }

  // SAFETY: At this point it is safe to use TypeScript's non-null assertion
  // operator because if the `candidate.root` didn't exist, `parseCandidate`
  // would have returned `null` and we would have returned early resulting in
  // not hitting this code path.
  let { applyFn } = variants.get(variant.root)!

  if (variant.kind === 'compound') {
    // Some variants traverse the AST to mutate the nodes. E.g.: `group-*` wants
    // to prefix every selector of the variant it's compounding with `.group`.
    //
    // E.g.:
    // ```
    // group-hover:[&_p]:flex
    // ```
    //
    // Should only prefix the `group-hover` part with `.group`, and not the `&_p` part.
    //
    // To solve this, we provide an isolated placeholder node to the variant.
    // The variant can now apply its logic to the isolated node without
    // affecting the original node.
    let isolatedNode = atRule('@slot')

    let result = applyVariant(isolatedNode, variant.variant, variants, depth + 1)
    if (result === null) return null

    for (let child of isolatedNode.nodes) {
      // Only some variants wrap children in rules. For example, the `force`
      // variant is a noop on the AST. And the `has` variant modifies the
      // selector rather than the children.
      //
      // This means `child` may be a declaration and we don't want to apply the
      // variant to it. This also means the entire variant as a whole is not
      // applicable to the rule and should generate nothing.
      if (child.kind !== 'rule' && child.kind !== 'at-rule') return null

      let result = applyFn(child, variant)
      if (result === null) return null
    }

    // Replace the placeholder node with the actual node
    {
      walk(isolatedNode.nodes, (child) => {
        if ((child.kind === 'rule' || child.kind === 'at-rule') && child.nodes.length <= 0) {
          child.nodes = node.nodes
          return WalkAction.Skip
        }
      })
      node.nodes = isolatedNode.nodes
    }
    return
  }

  // All other variants
  let result = applyFn(node, variant)
  if (result === null) return null
}

function isFallbackUtility(utility: Utility) {
  let types = utility.options?.types ?? []
  return types.length > 1 && types.includes('any')
}

function compileBaseUtility(candidate: Candidate, designSystem: DesignSystem) {
  if (candidate.kind === 'arbitrary') {
    let value: string | null = candidate.value

    // Assumption: If an arbitrary property has a modifier, then we assume it
    // is an opacity modifier.
    if (candidate.modifier) {
      value = asColor(value, candidate.modifier, designSystem.theme)
    }

    if (value === null) return []

    return [[decl(candidate.property, value)]]
  }

  let utilities = designSystem.utilities.get(candidate.root) ?? []

  let asts: AstNode[][] = []

  let normalUtilities = utilities.filter((u) => !isFallbackUtility(u))
  for (let utility of normalUtilities) {
    if (utility.kind !== candidate.kind) continue

    let compiledNodes = utility.compileFn(candidate)
    if (compiledNodes === undefined) continue
    if (compiledNodes === null) return asts
    asts.push(compiledNodes)
  }

  if (asts.length > 0) return asts

  let fallbackUtilities = utilities.filter((u) => isFallbackUtility(u))
  for (let utility of fallbackUtilities) {
    if (utility.kind !== candidate.kind) continue

    let compiledNodes = utility.compileFn(candidate)
    if (compiledNodes === undefined) continue
    if (compiledNodes === null) return asts
    asts.push(compiledNodes)
  }

  return asts
}

function applyImportant(ast: AstNode[]): void {
  for (let node of ast) {
    // Skip any `AtRoot` nodes — we don't want to make the contents of things
    // like `@keyframes` or `@property` important.
    if (node.kind === 'at-root') {
      continue
    }

    if (node.kind === 'declaration') {
      node.important = true
    } else if (node.kind === 'rule' || node.kind === 'at-rule') {
      applyImportant(node.nodes)
    }
  }
}

function getPropertySort(nodes: AstNode[]) {
  // Determine sort order based on properties used
  let propertySort = new Set<number>()
  let q: AstNode[] = nodes.slice()

  while (q.length > 0) {
    // SAFETY: At this point it is safe to use TypeScript's non-null assertion
    // operator because we guarded against `q.length > 0` above.
    let node = q.shift()!
    if (node.kind === 'declaration') {
      if (node.property === '--tw-sort') {
        let idx = GLOBAL_PROPERTY_ORDER.indexOf(node.value ?? '')
        if (idx !== -1) {
          propertySort.add(idx)
          break
        }
      }

      let idx = GLOBAL_PROPERTY_ORDER.indexOf(node.property)
      if (idx !== -1) propertySort.add(idx)
    } else if (node.kind === 'rule' || node.kind === 'at-rule') {
      for (let child of node.nodes) {
        q.push(child)
      }
    }
  }

  return Array.from(propertySort).sort((a, z) => a - z)
}
