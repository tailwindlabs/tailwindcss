import {
  atRule,
  context,
  decl,
  rule,
  type AstNode,
  type Comment,
  type Declaration,
  type Rule,
  type StyleRule,
} from './ast'
import { type Candidate, type Variant } from './candidate'
import { CompileAstFlags, type DesignSystem } from './design-system'
import GLOBAL_PROPERTY_ORDER from './property-order'
import { asColor, type Utility } from './utilities'
import { compare } from './utils/compare'
import { escape } from './utils/escape'
import { segment } from './utils/segment'
import type { Variants } from './variants'
import { walk, WalkAction } from './walk'

export function compileCandidates(
  rawCandidates: Iterable<string>,
  designSystem: DesignSystem,
  {
    onInvalidCandidate,
    respectImportant,
  }: { onInvalidCandidate?: (candidate: string) => void; respectImportant?: boolean } = {},
) {
  let nodeSorting = new Map<
    AstNode,
    { properties: { order: number[]; count: number }; variants: bigint; candidate: string }
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

  let flags = CompileAstFlags.None

  if (respectImportant ?? true) {
    flags |= CompileAstFlags.RespectImportant
  }

  // The variant order is only used to sort the rules of different candidates, so
  // a single candidate doesn't need it. Sorting all the parsed variants is
  // expensive, and canonicalization compiles every known variant on its own, each
  // of which adds a parsed variant that would invalidate the previous order.
  let variantOrderMap = matches.size > 1 ? designSystem.getVariantOrder() : null

  // Create the AST
  for (let [rawCandidate, candidates] of matches) {
    let found = false

    for (let candidate of candidates) {
      let rules = designSystem.compileAstNodes(candidate, flags)
      if (rules.length === 0) continue

      found = true

      for (let { node, propertySort } of rules) {
        // Track the variant order which is a number with each bit representing a
        // variant. This allows us to sort the rules based on the order of
        // variants used.
        let variantOrder = 0n
        if (variantOrderMap !== null) {
          for (let variant of candidate.variants) {
            variantOrder |= 1n << BigInt(variantOrderMap.get(variant)!)
          }
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
      offset < aSorting.properties.order.length &&
      offset < zSorting.properties.order.length &&
      aSorting.properties.order[offset] === zSorting.properties.order[offset]
    ) {
      offset += 1
    }

    return (
      // Sort by lowest property index first
      (aSorting.properties.order[offset] ?? Infinity) -
        (zSorting.properties.order[offset] ?? Infinity) ||
      // Sort by most properties first, then by least properties
      zSorting.properties.count - aSorting.properties.count ||
      // Sort alphabetically
      compare(aSorting.candidate, zSorting.candidate)
    )
  })

  return {
    astNodes,
    nodeSorting,
  }
}

export function compileAstNodes(
  candidate: Candidate,
  designSystem: DesignSystem,
  flags: CompileAstFlags,
) {
  let asts = compileBaseUtility(candidate, designSystem)
  if (asts.length === 0) return []

  let respectImportant = designSystem.important && Boolean(flags & CompileAstFlags.RespectImportant)

  let rules: {
    node: AstNode
    propertySort: {
      order: number[]
      count: number
    }
  }[] = []

  let selector = `.${escape(candidate.raw)}`

  for (let nodes of asts) {
    let propertySort = getPropertySort(nodes)

    // If the candidate itself is important then we want to always mark
    // the utility as important. However, at a design system level we want
    // to be able to opt-out when using things like `@apply`
    if (candidate.important || respectImportant) {
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

    // Stacked variants can make the selectors grow exponentially once the
    // nesting is flattened. Discard the candidate instead of generating (and
    // flattening) megabytes of CSS for it.
    if (flattenedSelectorLength(node) > MAX_FLATTENED_SELECTOR_LENGTH) return []

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

    let child: AstNode = rule(variant.selector, node.nodes)

    // Wrap variant-generated `@scope` rules in a `context` marker, so they are
    // hoisted with the variant semantics instead of their native CSS nesting
    // semantics. The slotted content is marked as `user` content, so `@scope`
    // rules defined there keep their native CSS nesting semantics.
    if (child.kind === 'at-rule' && child.name === '@scope') {
      child.nodes = [context({ source: 'user' }, node.nodes)]
      child = context({ source: 'variant' }, [child])
    }

    node.nodes = [child]
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

    if (variant.root === 'not' && isolatedNode.nodes.length > 1) {
      // The `not` variant cannot negate sibling rules / at-rules because these
      // are an OR relationship. Doing so would require transforming sibling
      // nodes into nesting while negating them. This isn't possible with the
      // current implementation of the `not` variant or with how variants are
      // applied in general (on a per-node basis).
      return null
    }

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

// The maximum length of the selectors of a single candidate, once the nesting
// is flattened.
//
// Flattening replaces each `&` with the parent selector, and prefixes each
// selector without `&` in a selector list with the parent selector. This means
// that stacked variants can multiply the length of the selectors. E.g.: each
// `[&_&]:` in `[&_&]:[&_&]:…:flex` doubles it, so the CSS grows exponentially
// with the number of variants. Variants with a selector list (`[&,.a]:`) or
// with multiple `@slot`s grow in the same way.
//
// Real candidates stay far below this limit. Most of them result in less than
// 2 KB of selectors, and even utilities with many nested rules (like `prose`
// from `@tailwindcss/typography`) with 10+ variants result in less than 50 KB.
// The limit still keeps a single candidate from generating megabytes of CSS.
const MAX_FLATTENED_SELECTOR_LENGTH = 1_000_000

// Estimates the length of the selectors in the output of `root`, once the
// nesting is flattened, without generating them. The estimate can be a bit too
// high, e.g. when a `&` is escaped.
function flattenedSelectorLength(root: StyleRule): number {
  // The rule of the candidate itself has no parent
  return selectorLength(root, new Map())[1]
}

// The selectors of `node` have a length of `a * P + b`, where `P` is the length
// of the parent selector. Variants with multiple `@slot`s re-use the same nodes
// for each `@slot`, so the result is cached to visit each node only once.
function selectorLength(
  node: Exclude<AstNode, Declaration | Comment>,
  cache: Map<AstNode, [a: number, b: number]>,
): [a: number, b: number] {
  let cached = cache.get(node)
  if (cached !== undefined) return cached

  let a = 0
  let b = 0
  let hasDeclarations = false
  for (let child of node.nodes) {
    if (child.kind === 'declaration') {
      hasDeclarations = true
    } else if (child.kind !== 'comment') {
      let length = selectorLength(child, cache)
      a += length[0]
      b += length[1]
    }
  }

  // The declarations of this node are emitted in a rule with the parent
  // selector
  if (hasDeclarations) a += 1

  let result: [a: number, b: number]
  if (node.kind === 'rule') {
    // Each `&` becomes `:is(<parent>)`, and a selector without `&` becomes
    // `<parent> <selector>`.
    let selectorA = 0
    let selectorB = 0
    let selectors = node.selector.includes(',') ? segment(node.selector, ',') : [node.selector]
    for (let selector of selectors) {
      let copies = Math.max(1, countNestingSelectors(selector))
      selectorA += copies
      selectorB += selector.length + copies * 5
    }

    // This rule is the parent of its children and declarations
    result = [selectorA * a, selectorB * a + b]
  } else if (node.kind === 'at-rule') {
    // A `&` in the params of `@scope (…)` becomes the parent selector too
    let copies = countNestingSelectors(node.params)
    result = [a + copies, b + node.params.length + copies * 5]
  } else if (node.kind === 'at-root') {
    // The children are hoisted to the root, without the parent selector
    result = [0, b]
  } else {
    result = [a, b]
  }

  cache.set(node, result)
  return result
}

function countNestingSelectors(input: string) {
  let count = 0
  for (let i = input.indexOf('&'); i !== -1; i = input.indexOf('&', i + 1)) {
    count += 1
  }
  return count
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
    if (compiledNodes === null) {
      // `null` means that the result is invalid and that this plugin should not
      // result in any CSS, but that doesn't mean that subsequent plugins are
      // invalid as well.
      //
      // However, for backwards compatibility with `matchUtilities` this means
      // that we do need to bail entirely: plugins that handle a specific
      // arbitrary value type prevent falling through to other plugins if the
      // result is invalid for that plugin
      if (utility.options?.types?.length) return asts

      continue
    }
    asts.push(compiledNodes)
  }

  if (asts.length > 0) return asts

  let fallbackUtilities = utilities.filter((u) => isFallbackUtility(u))
  for (let utility of fallbackUtilities) {
    if (utility.kind !== candidate.kind) continue

    let compiledNodes = utility.compileFn(candidate)
    if (compiledNodes === undefined) continue
    if (compiledNodes === null) {
      // `null` means that the result is invalid and that this plugin should not
      // result in any CSS, but that doesn't mean that subsequent plugins are
      // invalid as well.
      //
      // However, for backwards compatibility with `matchUtilities` this means
      // that we do need to bail entirely: plugins that handle a specific
      // arbitrary value type prevent falling through to other plugins if the
      // result is invalid for that plugin
      if (utility.options?.types?.length) return asts

      continue
    }
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
  let order = new Set<number>()
  let count = 0
  let q: AstNode[] = nodes.slice()

  let seenTwSort = false

  while (q.length > 0) {
    // SAFETY: At this point it is safe to use TypeScript's non-null assertion
    // operator because we guarded against `q.length > 0` above.
    let node = q.shift()!
    if (node.kind === 'declaration') {
      // Empty strings should still be counted, e.g.: `--tw-foo:;` is valid
      if (node.value === undefined) continue

      count++

      if (seenTwSort) continue

      if (node.property === '--tw-sort') {
        let idx = GLOBAL_PROPERTY_ORDER.indexOf(node.value ?? '')
        if (idx !== -1) {
          order.add(idx)
          seenTwSort = true
          continue
        }
      }

      let idx = GLOBAL_PROPERTY_ORDER.indexOf(node.property)
      if (idx !== -1) order.add(idx)
    } else if (node.kind === 'rule' || node.kind === 'at-rule') {
      for (let child of node.nodes) {
        q.push(child)
      }
    }
  }

  return {
    order: Array.from(order).sort((a, z) => a - z),
    count,
  }
}
