import { atRule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'

export function registerScreensConfig(userConfig: ResolvedConfig, designSystem: DesignSystem) {
  let screens = userConfig.theme.screens || {}

  // We want to insert the breakpoints in the right order as best we can. In the
  // core utility, all static breakpoint variants and the `min-*` functional
  // variant are registered inside a group. Since all the variants within a
  // group share the same order, we can use the always-defined `min-*` variant
  // as the order.
  let coreOrder = designSystem.variants.get('min')?.order ?? 0

  let additionalVariants: ((order: number) => void)[] = []

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

    let deferInsert = true

    if (typeof value === 'string') {
      deferInsert = false
    }

    let query = buildMediaQuery(value)

    function insert(order: number) {
      // `min-*` and `max-*` rules do not need to be reconfigured, as they are
      // reading the latest values from the theme.
      designSystem.variants.static(
        name,
        (ruleNode) => {
          ruleNode.nodes = [atRule('@media', query, ruleNode.nodes)]
        },
        { order },
      )
    }

    if (deferInsert) {
      additionalVariants.push(insert)
    } else {
      insert(coreOrder)
    }
  }

  // Reserve and insert slots for the additional variants
  if (additionalVariants.length === 0) return

  for (let [, variant] of designSystem.variants.variants) {
    if (variant.order > coreOrder) variant.order += additionalVariants.length
  }

  designSystem.variants.compareFns = new Map(
    Array.from(designSystem.variants.compareFns).map(([key, value]) => {
      if (key > coreOrder) key += additionalVariants.length
      return [key, value]
    }),
  )

  for (let [index, callback] of additionalVariants.entries()) {
    callback(coreOrder + index + 1)
  }
}

export function buildMediaQuery(values: unknown) {
  type ScreenDescriptor = {
    min?: string
    max?: string
    raw?: string
  }

  let list: unknown[] = Array.isArray(values) ? values : [values]
  return list
    .map((value): ScreenDescriptor | null => {
      if (typeof value === 'string') {
        return { min: value }
      }

      if (value && typeof value === 'object') {
        return value
      }

      return null
    })
    .map((screen) => {
      if (screen === null) return null

      if ('raw' in screen) {
        return screen.raw
      }

      let query = ''

      if (screen.max !== undefined) {
        query += `${screen.max} >= `
      }

      query += 'width'

      if (screen.min !== undefined) {
        query += ` >= ${screen.min}`
      }

      return `(${query})`
    })
    .filter(Boolean)
    .join(', ')
}
