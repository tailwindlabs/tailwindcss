import { styleRule, walkDepth } from './ast'
import { applyVariant } from './compile'
import type { DesignSystem } from './design-system'
import { compare } from './utils/compare'
import { DefaultMap } from './utils/default-map'

interface ClassMetadata {
  modifiers: string[]
}

export type ClassItem = {
  name: string
  utility: string
  fraction: boolean
  modifiers: string[]
}

export type ClassEntry = [string, ClassMetadata]

const IS_FRACTION = /^\d+\/\d+$/

export function getClassList(design: DesignSystem): ClassEntry[] {
  let list: ClassItem[] = []

  // Static utilities only work as-is
  for (let utility of design.utilities.keys('static')) {
    list.push({
      name: utility,
      utility,
      fraction: false,
      modifiers: [],
    })
  }

  // Functional utilities have their own list of completions
  for (let utility of design.utilities.keys('functional')) {
    let completions = design.utilities.getCompletions(utility)

    for (let group of completions) {
      for (let value of group.values) {
        let fraction = value !== null && IS_FRACTION.test(value)

        let name = value === null ? utility : `${utility}-${value}`

        list.push({
          name,
          utility,
          fraction,
          modifiers: group.modifiers,
        })

        if (group.supportsNegative) {
          list.push({
            name: `-${name}`,
            utility: `-${utility}`,
            fraction,
            modifiers: group.modifiers,
          })
        }
      }
    }
  }

  if (list.length === 0) return []

  // Sort utilities by their class name
  list.sort((a, b) => compare(a.name, b.name))

  let entries = sortFractionsLast(list)

  return entries
}

function sortFractionsLast(list: ClassItem[]) {
  type Bucket = {
    utility: string
    items: ClassItem[]
  }

  // 1. Create "buckets" for each utility group
  let buckets: Bucket[] = []
  let current: Bucket | null = null

  // 2. Determine the last bucket for each utility group
  let lastUtilityBucket = new Map<string, Bucket>()

  // 3. Collect all fractions in a given utility group
  let fractions = new DefaultMap<string, ClassItem[]>(() => [])

  for (let item of list) {
    let { utility, fraction } = item

    if (!current) {
      current = { utility, items: [] }
      lastUtilityBucket.set(utility, current)
    }

    if (utility !== current.utility) {
      buckets.push(current)

      current = { utility, items: [] }
      lastUtilityBucket.set(utility, current)
    }

    if (fraction) {
      fractions.get(utility).push(item)
    } else {
      current.items.push(item)
    }
  }

  if (current && buckets[buckets.length - 1] !== current) {
    buckets.push(current)
  }

  // 4. Add fractions to their respective last utility buckets
  for (let [utility, items] of fractions) {
    let bucket = lastUtilityBucket.get(utility)
    if (!bucket) continue

    bucket.items.push(...items)
  }

  // 5. Flatten the buckets into a single list
  let entries: ClassEntry[] = []

  for (let bucket of buckets) {
    for (let entry of bucket.items) {
      entries.push([entry.name, { modifiers: entry.modifiers }])
    }
  }

  return entries
}

interface SelectorOptions {
  modifier?: string
  value?: string
}

export interface VariantEntry {
  name: string
  isArbitrary: boolean
  values: string[]
  hasDash: boolean
  selectors: (options: SelectorOptions) => string[]
}

export function getVariants(design: DesignSystem) {
  let list: VariantEntry[] = []

  for (let [root, variant] of design.variants.entries()) {
    if (variant.kind === 'arbitrary') continue

    let hasDash = root !== '@'
    let values = design.variants.getCompletions(root)

    function selectors({ value, modifier }: SelectorOptions = {}) {
      let name = root
      if (value) name += hasDash ? `-${value}` : value
      if (modifier) name += `/${modifier}`

      let variant = design.parseVariant(name)

      if (!variant) return []

      // Apply the variant to a placeholder rule
      let node = styleRule('.__placeholder__', [])

      // If the rule produces no nodes it means the variant does not apply
      if (applyVariant(node, variant, design.variants) === null) {
        return []
      }

      // Now look at the selector(s) inside the rule
      let selectors: string[] = []

      // Produce v3-style selector strings in the face of nested rules
      // this is more visible for things like group-*, not-*, etc…
      walkDepth(node.nodes, (node, { path }) => {
        if (node.kind !== 'rule' && node.kind !== 'at-rule') return
        if (node.nodes.length > 0) return

        // Sort at-rules before style rules
        path.sort((a, b) => {
          let aIsAtRule = a.kind === 'at-rule'
          let bIsAtRule = b.kind === 'at-rule'

          if (aIsAtRule && !bIsAtRule) return -1
          if (!aIsAtRule && bIsAtRule) return 1

          return 0
        })

        // A list of the selectors / at rules encountered to get to this point
        let group = path.flatMap((node) => {
          if (node.kind === 'rule') {
            return node.selector === '&' ? [] : [node.selector]
          }

          if (node.kind === 'at-rule') {
            return [`${node.name} ${node.params}`]
          }

          return []
        })

        // Build a v3-style nested selector
        let selector = ''

        for (let i = group.length - 1; i >= 0; i--) {
          selector = selector === '' ? group[i] : `${group[i]} { ${selector} }`
        }

        selectors.push(selector)
      })

      return selectors
    }

    switch (variant.kind) {
      case 'static': {
        list.push({
          name: root,
          values,
          isArbitrary: false,
          hasDash,
          selectors,
        })
        break
      }
      case 'functional': {
        list.push({
          name: root,
          values,
          isArbitrary: true,
          hasDash,
          selectors,
        })
        break
      }
      case 'compound': {
        list.push({
          name: root,
          values,
          isArbitrary: true,
          hasDash,
          selectors,
        })
        break
      }
    }
  }

  return list
}
