import { decl, rule } from './ast'
import { applyVariant } from './compile'
import type { DesignSystem } from './design-system'

interface ClassMetadata {
  modifiers: string[]
}

export type ClassEntry = [string, ClassMetadata]

export function getClassList(design: DesignSystem): ClassEntry[] {
  let list: [string, ClassMetadata][] = []

  for (let [utility, fn] of design.utilities.entries()) {
    if (typeof utility !== 'string') {
      continue
    }

    // Static utilities only work as-is
    if (fn.kind === 'static') {
      list.push([utility, { modifiers: [] }])
      continue
    }

    // Functional utilities have their own list of completions
    let completions = design.utilities.getCompletions(utility)

    for (let group of completions) {
      for (let value of group.values) {
        let name = value === null ? utility : `${utility}-${value}`

        list.push([name, { modifiers: group.modifiers }])

        if (group.supportsNegative) {
          list.push([`-${name}`, { modifiers: group.modifiers }])
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
      let node = rule('.__placeholder__', [decl('color', 'red')])

      // If the rule produces no nodes it means the variant does not apply
      if (applyVariant(node, variant, design.variants) === null) {
        return []
      }

      // Now look at the selector(s) inside the rule
      let selectors: string[] = []

      for (let child of node.nodes) {
        if (child.kind === 'rule') {
          selectors.push(child.selector)
        }
      }

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
