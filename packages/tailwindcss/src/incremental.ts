import { Polyfills } from '.'
import { atRule, CACHEABLE, decl, HOISTABLE_AT_RULES, optimizeAst, rule, type AstNode } from './ast'
import type { Candidate, Variant } from './candidate'
import { CompileAstFlags, type DesignSystem } from './design-system'
import { compare } from './utils/compare'

// An incremental version of the utilities part of `build()`.
//
// The AST of each candidate is already cached by the design system, but the
// steps after that (sorting, `optimizeAst`, `handleNesting` and `toCss`) used
// to run over the entire stylesheet whenever a single new candidate showed up.
//
// Instead, we cache the optimized and flattened output of each utility node.
// A build then:
//
// 1. Compiles and sorts only the new candidates, and merges them into the
//    list of already sorted candidates.
// 2. Optimizes and flattens only the new utilities, and stitches the cached
//    output of all utilities together. Adjacent at-rules (e.g. `@media`) and
//    rules with the same selector are merged, the same way `handleNesting`
//    merges them.
// 3. Runs `optimizeAst` on the rest of the stylesheet, which is small compared
//    to the utilities.
//
// `toCss` caches the printed CSS of the cached nodes as well (see `CACHEABLE`).
//
// The output is identical to the output of the non-incremental build. When we
// find something we can't handle, `build()` returns `null` and the caller falls
// back to the non-incremental build.

interface SortInfo {
  node: AstNode
  candidate: Candidate
  raw: string
  order: number[]
  count: number
  variants: bigint
}

interface CachedUtility {
  // The optimized and flattened output, without the at-rules that wrap the
  // `@tailwind utilities` node (e.g. `@layer utilities`).
  nodes: AstNode[]

  // The `@at-root` nodes of the utility. These are hoisted by `optimizeAst`
  // when it optimizes the rest of the stylesheet.
  atRoots: AstNode[]

  // The values of all `animation` declarations, `optimizeAst` uses these to
  // remove unused `@keyframes`.
  animations: string[]
}

// Placeholder for the utilities while we optimize the rest of the stylesheet.
const PLACEHOLDER = '\0tw-utilities'

export function createIncrementalBuild(
  ast: AstNode[],
  utilitiesNode: AstNode & { nodes: AstNode[] },
  designSystem: DesignSystem,
  polyfills: Polyfills = Polyfills.All,
  onInvalidCandidate: (candidate: string) => void,
) {
  let found = findWrappingAtRules(ast, utilitiesNode)
  if (found === null) return null

  const wrappers: [name: string, params: string][] = found

  let utilitiesAtRoot = wrappers.length === 0

  let sorted: SortInfo[] = []
  let variantOrder: Map<Variant, number> | null = null
  let cache = new WeakMap<AstNode, CachedUtility>()
  let previous: AstNode[] | null = null

  function variantBits(candidate: Candidate) {
    let bits = 0n
    for (let variant of candidate.variants) {
      bits |= 1n << BigInt(variantOrder!.get(variant)!)
    }
    return bits
  }

  // Same order as `compileCandidates(…)`
  function compareSortInfo(a: SortInfo, z: SortInfo) {
    if (a.variants !== z.variants) return a.variants < z.variants ? -1 : 1

    let offset = 0
    while (
      offset < a.order.length &&
      offset < z.order.length &&
      a.order[offset] === z.order[offset]
    ) {
      offset += 1
    }

    return (
      (a.order[offset] ?? Infinity) - (z.order[offset] ?? Infinity) ||
      z.count - a.count ||
      compare(a.raw, z.raw)
    )
  }

  function getCachedUtility(node: AstNode): CachedUtility | null {
    let cached = cache.get(node)
    if (cached) return cached

    let atRoots: AstNode[] = []
    let animations: string[] = []
    if (!collectAtRootsAndAnimations([node], atRoots, animations, false)) return null

    let nodes = flattenSimpleUtility(node) ?? flattenUtility(node)
    if (nodes === null) return null

    markCacheable(nodes)
    cached = { nodes, atRoots, animations }
    cache.set(node, cached)
    return cached
  }

  // Optimize and flatten a single utility, in the same context as the
  // `@tailwind utilities` node.
  function flattenUtility(node: AstNode): AstNode[] | null {
    let wrapped: AstNode = node
    for (let i = wrappers.length - 1; i >= 0; i--) {
      wrapped = atRule(wrappers[i][0], wrappers[i][1], [wrapped])
    }

    let nodes = optimizeAst([wrapped], designSystem, polyfills, true)

    // Unwrap the at-rules again
    for (let [name, params] of wrappers) {
      if (nodes.length === 0) break

      let wrapper = nodes[0]
      if (
        nodes.length !== 1 ||
        wrapper.kind !== 'at-rule' ||
        wrapper.name !== name ||
        wrapper.params !== params
      ) {
        return null
      }

      nodes = wrapper.nodes
    }

    return nodes
  }

  // The most common utility is a rule with only declarations, e.g. `.flex {
  // display: flex }`. This results in the same output as `flattenUtility(…)`,
  // without the setup cost of `optimizeAst(…)` and `handleNesting(…)`.
  function flattenSimpleUtility(node: AstNode): AstNode[] | null {
    if (node.kind !== 'rule' || node.selector.includes('&')) return null

    let declarations: AstNode[] = []
    let seen = new Set<string>()
    for (let child of node.nodes) {
      if (child.kind !== 'declaration') return null
      if (child.property === '--tw-sort' || child.value == null) continue

      // Duplicate properties are deduplicated by `handleNesting`
      if (seen.has(child.property)) return null
      seen.add(child.property)

      // Needs the `color-mix(…)` polyfill
      if (polyfills & Polyfills.ColorMix && child.value.includes('color-mix(')) return null

      if (child.value.includes('var(')) designSystem.trackUsedVariables(child.value)
      declarations.push(child)
    }

    if (declarations.length === 0) return []

    let copy = rule(node.selector, declarations)
    if (node.src) copy.src = node.src
    if (node.dst) copy.dst = node.dst
    return [copy]
  }

  return function build(candidates: Iterable<string>, force: boolean): AstNode[] | null {
    // Compile the new candidates
    let added: Omit<SortInfo, 'variants'>[] = []
    for (let raw of candidates) {
      if (designSystem.invalidCandidates.has(raw)) continue

      let found = false
      for (let candidate of designSystem.parseCandidate(raw)) {
        let rules = designSystem.compileAstNodes(candidate, CompileAstFlags.RespectImportant)
        for (let { node, propertySort } of rules) {
          found = true
          added.push({ node, candidate, raw, ...propertySort })
        }
      }

      if (!found) onInvalidCandidate(raw)
    }

    // New variants can move the bits of existing variants, but they never
    // change the relative order of the candidates we already sorted. So
    // updating their bits is enough.
    let nextVariantOrder = designSystem.getVariantOrder()
    if (nextVariantOrder !== variantOrder) {
      variantOrder = nextVariantOrder
      for (let info of sorted) info.variants = variantBits(info.candidate)
    }

    if (added.length === 0 && !force && previous !== null) return previous

    // Sort the new candidates, and merge them into the sorted candidates
    let infos: SortInfo[] = added.map((info) => ({
      ...info,
      variants: variantBits(info.candidate),
    }))
    infos.sort(compareSortInfo)

    if (infos.length > 0) {
      let merged: SortInfo[] = new Array(sorted.length + infos.length)
      let i = 0
      let j = 0
      let k = 0
      while (i < sorted.length && j < infos.length) {
        merged[k++] = compareSortInfo(sorted[i], infos[j]) <= 0 ? sorted[i++] : infos[j++]
      }
      while (i < sorted.length) merged[k++] = sorted[i++]
      while (j < infos.length) merged[k++] = infos[j++]
      sorted = merged
    }

    // Stitch the flattened utilities together
    let utilities: AstNode[] = []
    let atRoots: AstNode[] = []
    let animations = new Set<string>()
    let merged = new Set<AstNode[]>()
    for (let info of sorted) {
      let cached = getCachedUtility(info.node)
      if (cached === null) return null

      for (let node of cached.nodes) mergeInto(utilities, node, merged, utilitiesAtRoot)
      for (let node of cached.atRoots) atRoots.push(node)
      for (let value of cached.animations) animations.add(value)
    }

    // Optimize the rest of the stylesheet with a placeholder for the
    // utilities. The placeholder carries the `animation` declarations of the
    // utilities, so that `optimizeAst` can still remove unused `@keyframes`.
    let placeholder = rule(PLACEHOLDER, [decl('--tw-placeholder', '1')])
    for (let value of animations) placeholder.nodes.push(decl('animation', value))
    utilitiesNode.nodes = [placeholder, ...atRoots]

    let result = optimizeAst(ast, designSystem, polyfills)

    // Replace the placeholder with the utilities
    let parent = findParentOfPlaceholder(result)
    if (parent === null) return null

    let idx = parent.findIndex((node) => node.kind === 'rule' && node.selector === PLACEHOLDER)
    let isRoot = parent === result
    let nodes = parent.slice(0, idx)
    for (let node of utilities) mergeInto(nodes, node, merged, isRoot)
    for (let i = idx + 1; i < parent.length; i++) mergeInto(nodes, parent[i], merged, isRoot)
    parent.splice(0, parent.length, ...nodes)

    for (let nodes of merged) dedupeDeclarations(nodes)

    previous = result
    return result
  }
}

// Merge `node` into the end of `list`, the same way `handleNesting` merges
// adjacent at-rules and rules with the same selector. Cached nodes are copied
// before they are merged into, they are never mutated.
function mergeInto(list: AstNode[], node: AstNode, merged: Set<AstNode[]>, isRoot: boolean) {
  let last = list[list.length - 1]
  if (!last) {
    list.push(node)
    return
  }

  // At the root, `handleNesting` drops repeated at-rules without a body, e.g.
  // `@layer foo;`
  if (
    isRoot &&
    last.kind === 'at-rule' &&
    node.kind === 'at-rule' &&
    last.nodes.length === 0 &&
    node.nodes.length === 0 &&
    last.name === node.name &&
    last.params === node.params
  ) {
    return
  }

  if (
    last.kind === 'at-rule' &&
    node.kind === 'at-rule' &&
    HOISTABLE_AT_RULES.has(node.name) &&
    last.name === node.name &&
    last.params === node.params &&
    last.nodes.length > 0 &&
    node.nodes.length > 0
  ) {
    if (CACHEABLE.has(last)) {
      last = { ...last, nodes: last.nodes.slice() }
      list[list.length - 1] = last
    }

    for (let child of node.nodes) mergeInto(last.nodes, child, merged, false)
    return
  }

  if (last.kind === 'rule' && node.kind === 'rule' && last.selector === node.selector) {
    if (CACHEABLE.has(last)) {
      last = { ...last, nodes: last.nodes.slice() }
      list[list.length - 1] = last
    }

    last.nodes.push(...node.nodes)
    merged.add(last.nodes)
    return
  }

  list.push(node)
}

// Same as the deduplication at the end of `handleNesting`
function dedupeDeclarations(nodes: AstNode[]) {
  let seen = new Set<string>()
  for (let i = nodes.length - 1; i >= 0; --i) {
    let node = nodes[i]
    if (node.kind !== 'declaration') continue

    let id = `${node.property}\0${node.value}\0${node.important}`
    if (seen.has(id)) nodes.splice(i, 1)
    else seen.add(id)
  }
}

function markCacheable(nodes: AstNode[]) {
  for (let node of nodes) {
    if (node.kind === 'rule' || node.kind === 'at-rule') {
      CACHEABLE.add(node)
      markCacheable(node.nodes)
    }
  }
}

// Collect the `@at-root` nodes and the `animation` values of a utility, in the
// same order as `optimizeAst` visits them. Returns `false` for contexts where
// `optimizeAst` would treat the `@at-root` nodes differently.
function collectAtRootsAndAnimations(
  nodes: AstNode[],
  atRoots: AstNode[],
  animations: string[],
  inSpecialContext: boolean,
): boolean {
  for (let node of nodes) {
    if (node.kind === 'declaration') {
      if (node.property === 'animation' && node.value != null) animations.push(node.value)
    } else if (node.kind === 'at-root') {
      if (inSpecialContext) return false
      atRoots.push(node)
    } else if (node.kind === 'context') {
      if (node.context.reference) continue
      if (node.context.theme || node.context.keyframes) return false
      if (!collectAtRootsAndAnimations(node.nodes, atRoots, animations, inSpecialContext)) {
        return false
      }
    } else if (node.kind === 'rule' || node.kind === 'at-rule') {
      let special =
        inSpecialContext ||
        (node.kind === 'at-rule' &&
          (node.name === '@keyframes' ||
            (node.name === '@supports' && node.params.includes('color-mix('))))
      if (!collectAtRootsAndAnimations(node.nodes, atRoots, animations, special)) return false
    }
  }

  return true
}

// Find the at-rules that wrap the `@tailwind utilities` node, e.g. `@layer
// utilities`. Returns `null` when the node is somewhere we can't handle, e.g.
// inside of a rule.
function findWrappingAtRules(ast: AstNode[], target: AstNode): [string, string][] | null {
  let found: [string, string][] | null = null

  function visit(nodes: AstNode[], wrappers: [string, string][] | null): boolean {
    for (let node of nodes) {
      if (node === target) {
        found = wrappers
        return true
      }

      if (node.kind === 'at-rule') {
        let supported =
          wrappers !== null &&
          HOISTABLE_AT_RULES.has(node.name) &&
          node.name !== '@scope' &&
          !node.params.includes('color-mix(')

        let next: [string, string][] | null = supported
          ? [...wrappers!, [node.name, node.params]]
          : null
        if (visit(node.nodes, next)) return true
      } else if (node.kind === 'context') {
        let { theme, keyframes, reference, source } = node.context
        let supported = wrappers !== null && !theme && !keyframes && !reference && !source
        if (visit(node.nodes, supported ? wrappers : null)) return true
      } else if (node.kind === 'rule' || node.kind === 'at-root') {
        if (visit(node.nodes, null)) return true
      }
    }

    return false
  }

  visit(ast, [])
  return found
}

function findParentOfPlaceholder(nodes: AstNode[]): AstNode[] | null {
  for (let node of nodes) {
    if (node.kind === 'rule' && node.selector === PLACEHOLDER) return nodes
    if (node.kind === 'rule' || node.kind === 'at-rule') {
      let parent = findParentOfPlaceholder(node.nodes)
      if (parent) return parent
    }
  }

  return null
}
