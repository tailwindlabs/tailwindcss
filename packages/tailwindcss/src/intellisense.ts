import { styleRule, walkDepth } from './ast'
import { applyVariant } from './compile'
import type { DesignSystem } from './design-system'

export interface ClassMetadata {
  modifiers: string[]
  deprecated: boolean
}

export type ClassEntry = [string, ClassMetadata]

export function getClassMetadata(
  design: DesignSystem,
  classes: string[],
): (ClassMetadata | null)[] {
  let list: (ClassMetadata | null)[] = []

  for (let className of classes) {
    let candidates = design.parseCandidate(className)
    if (candidates.length === 0) {
      list.push(null)
      continue
    }

    let modifiers: string[] = []
    let deprecated: boolean[] = []

    for (let candidate of candidates) {
      if (candidate.kind === 'arbitrary') continue
      if (candidate.kind === 'static') continue

      let utilities = design.utilities.get(candidate.root)
      let completions = design.utilities.getCompletions(candidate.root)

      let isDeprecated = utilities.every((utility) => utility.options?.deprecated ?? false)

      for (let group of completions) {
        if (group.values.length === 0) continue

        for (let value of group.values) {
          if (value === null && candidate.value === null) {
            modifiers.push(...group.modifiers)

            if (group.deprecated) isDeprecated = true
          } else if (candidate.value?.kind === 'named' && value === candidate.value.value) {
            modifiers.push(...group.modifiers)

            if (group.deprecated) isDeprecated = true
          }
        }
      }

      deprecated.push(isDeprecated)
    }

    list.push({
      modifiers,

      // When multiple candidates are generated and only some are deprecated we
      // we will not report that the class is deprecated because of ambiguity.
      // Marking it as such is not useful because the user might be using it for
      // the non-deprecated purpose from of a plugin.
      deprecated: deprecated.length > 0 && deprecated.every((value) => value),
    })
  }

  return list
}

export function getClassList(design: DesignSystem): ClassEntry[] {
  let list: [string, ClassMetadata][] = []

  // Static utilities only work as-is
  for (let utility of design.utilities.keys('static')) {
    let utilities = design.utilities.get(utility)
    let completions = design.utilities.getCompletions(utility)

    let deprecated =
      utilities.every((utility) => utility.options?.deprecated ?? false) ||
      (completions.length > 0 && completions.every((group) => group.deprecated))

    list.push([
      utility,
      {
        modifiers: [],
        deprecated,
      },
    ])
  }

  // Functional utilities have their own list of completions
  for (let utility of design.utilities.keys('functional')) {
    let completions = design.utilities.getCompletions(utility)

    for (let group of completions) {
      for (let value of group.values) {
        let name = value === null ? utility : `${utility}-${value}`

        list.push([name, { modifiers: group.modifiers, deprecated: group.deprecated }])

        if (group.supportsNegative) {
          list.push([`-${name}`, { modifiers: group.modifiers, deprecated: group.deprecated }])
        }
      }
    }
  }

  list.sort((a, b) => (a[0] === b[0] ? 0 : a[0] < b[0] ? -1 : 1))

  return list
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

    let values = design.variants.getCompletions(root)

    function selectors({ value, modifier }: SelectorOptions = {}) {
      let name = root
      if (value) name += `-${value}`
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
          hasDash: true,
          selectors,
        })
        break
      }
      case 'functional': {
        list.push({
          name: root,
          values,
          isArbitrary: true,
          hasDash: true,
          selectors,
        })
        break
      }
      case 'compound': {
        list.push({
          name: root,
          values,
          isArbitrary: true,
          hasDash: true,
          selectors,
        })
        break
      }
    }
  }

  return list
}
