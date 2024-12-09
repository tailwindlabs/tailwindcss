import { styleRule, walkDepth } from './ast'
import { applyVariant } from './compile'
import type { DesignSystem } from './design-system'

interface ClassMetadata {
  modifiers: string[]
}

export type ClassEntry = [string, ClassMetadata]

export function getClassList(design: DesignSystem): ClassEntry[] {
  let list: [string, ClassMetadata][] = []

  // Static utilities only work as-is
  for (let utility of design.utilities.keys('static')) {
    list.push([utility, { modifiers: [] }])
  }

  // Functional utilities have their own list of completions
  for (let utility of design.utilities.keys('functional')) {
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

export interface ThemeEntry {
  kind: 'namespace' | 'variable'
  name: string
}

export function getThemeEntries(): ThemeEntry[] {
  return [
    // Polyfill data for older versions of the design system
    { kind: 'variable', name: '--default-transition-duration' },
    { kind: 'variable', name: '--default-transition-timing-function' },
    { kind: 'variable', name: '--default-font-family' },
    { kind: 'variable', name: '--default-font-feature-settings' },
    { kind: 'variable', name: '--default-font-variation-settings' },
    { kind: 'variable', name: '--default-mono-font-family' },
    { kind: 'variable', name: '--default-mono-font-feature-settings' },
    { kind: 'variable', name: '--default-mono-font-variation-settings' },
    { kind: 'namespace', name: '--breakpoint' },
    { kind: 'namespace', name: '--color' },
    { kind: 'namespace', name: '--animate' },
    { kind: 'namespace', name: '--blur' },
    { kind: 'namespace', name: '--radius' },
    { kind: 'namespace', name: '--shadow' },
    { kind: 'namespace', name: '--inset-shadow' },
    { kind: 'namespace', name: '--drop-shadow' },
    { kind: 'variable', name: '--spacing' },
    { kind: 'namespace', name: '--container' },
    { kind: 'namespace', name: '--font' },
    { kind: 'namespace', name: '--font-size' },
    { kind: 'namespace', name: '--tracking' },
    { kind: 'namespace', name: '--leading' },
    { kind: 'namespace', name: '--ease' },
  ]
}
