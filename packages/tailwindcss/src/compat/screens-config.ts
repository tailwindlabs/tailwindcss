import { rule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'

export function registerScreensConfig(userConfig: ResolvedConfig, designSystem: DesignSystem) {
  let screens = userConfig.theme.screens || {}

  // We want to insert the breakpoints in the right order as best we can. In the
  // core utility, all static breakpoint variants and the `min-*` functional
  // variant are registered inside a group. Since all the variants within a
  // group share the same order, we can use the always-defined `min-*` variant
  // as the order.
  let order = designSystem.variants.get('min')?.order ?? undefined

  // Register static breakpoint variants for everything that comes from the user
  // theme config.
  for (let [name, value] of Object.entries(screens)) {
    let coreVariant = designSystem.variants.get(name)

    // Ignore it if there's a CSS value that takes precedence over the JS config
    // and the static utilities are already registered.
    //
    // This happens when a `@theme { }` block is used that overwrites all JS
    // config options. We rely on the resolution order of the Theme for
    // resolving this. If Theme has a different value, we know that this is not
    // coming from the JS plugin and thus we don't need to handle it explicitly.
    let cssValue = designSystem.theme.resolveValue(name, ['--breakpoint'])
    if (coreVariant && cssValue && !designSystem.theme.hasDefault(`--breakpoint-${name}`)) {
      continue
    }

    // min-${breakpoint} and max-${breakpoint} rules do not need to be
    // reconfigured, as they are using functional utilities and will not eagerly
    // capture the breakpoints before the compat layer runs.
    let query: string | undefined
    let insertOrder: number | undefined
    if (typeof value === 'string') {
      query = `(width >= ${value})`
      insertOrder = order
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        query = value.map(ruleForComplexScreenValue).join(', ')
      } else {
        query = ruleForComplexScreenValue(value) ?? ''
        if ('min' in value && !('max' in value)) {
          insertOrder = order
        }
      }
    } else {
      continue
    }

    if (order && insertOrder === undefined) {
      insertOrder = allocateOrderAfter(designSystem, order)
    }

    designSystem.variants.static(
      name,
      (ruleNode) => {
        ruleNode.nodes = [rule(`@media ${query}`, ruleNode.nodes)]
      },
      { order: insertOrder },
    )
  }
}

function allocateOrderAfter(designSystem: DesignSystem, order: number): number {
  for (let [, variant] of designSystem.variants.variants) {
    if (variant.order > order) variant.order++
  }
  designSystem.variants.compareFns = new Map(
    Array.from(designSystem.variants.compareFns).map(([key, value]) => {
      if (key > order) key++
      return [key, value]
    }),
  )
  return order + 1
}

function ruleForComplexScreenValue(value: object): string | null {
  let query = null
  if ('raw' in value && typeof value.raw === 'string') {
    query = value.raw
  } else {
    let rules: string[] = []

    if ('min' in value && typeof value.min === 'string') {
      rules.push(`min-width: ${value.min}`)
    }
    if ('max' in value && typeof value.max === 'string') {
      rules.push(`max-width: ${value.max}`)
    }

    if (rules.length !== 0) {
      query = `(${rules.join(' and ')})`
    }
  }
  return query
}
