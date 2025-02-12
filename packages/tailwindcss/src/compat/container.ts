import { atRule, decl, type AstNode, type AtRule } from '../ast'
import type { DesignSystem } from '../design-system'
import { compareBreakpoints } from '../utils/compare-breakpoints'
import type { ResolvedConfig } from './config/types'

export function registerContainerCompat(userConfig: ResolvedConfig, designSystem: DesignSystem) {
  let container = userConfig.theme.container || {}

  if (typeof container !== 'object' || container === null) {
    return
  }

  let rules = buildCustomContainerUtilityRules(container, designSystem)

  if (rules.length === 0) {
    return
  }

  designSystem.utilities.static('container', () => structuredClone(rules))
}

export function buildCustomContainerUtilityRules(
  {
    center,
    padding,
    screens,
  }: {
    center?: boolean
    padding?: string | {}
    screens?: {}
  },
  designSystem: DesignSystem,
): AstNode[] {
  let rules = []
  let breakpointOverwrites: null | Map<string, AtRule> = null

  if (center) {
    rules.push(decl('margin-inline', 'auto'))
  }

  if (
    typeof padding === 'string' ||
    (typeof padding === 'object' && padding !== null && 'DEFAULT' in padding)
  ) {
    rules.push(
      decl('padding-inline', typeof padding === 'string' ? padding : (padding.DEFAULT as string)),
    )
  }

  if (typeof screens === 'object' && screens !== null) {
    breakpointOverwrites = new Map()

    // When setting a the `screens` in v3, you were overwriting the default
    // screens config. To do this in v4, you have to manually unset all core
    // screens.

    let breakpoints = Array.from(designSystem.theme.namespace('--breakpoint').entries())
    breakpoints.sort((a, z) => compareBreakpoints(a[1], z[1], 'asc'))
    if (breakpoints.length > 0) {
      let [key] = breakpoints[0]
      // Unset all default breakpoints
      rules.push(
        atRule('@media', `(width >= --theme(--breakpoint-${key}))`, [decl('max-width', 'none')]),
      )
    }

    for (let [key, value] of Object.entries(screens)) {
      if (typeof value === 'object') {
        if ('min' in value) {
          value = value.min
        } else {
          continue
        }
      }

      // We're inlining the breakpoint values because the screens configured in
      // the `container` option do not have to match the ones defined in the
      // root `screen` setting.
      breakpointOverwrites.set(
        key,
        atRule('@media', `(width >= ${value})`, [decl('max-width', value)]),
      )
    }
  }

  if (typeof padding === 'object' && padding !== null) {
    let breakpoints = Object.entries(padding)
      .filter(([key]) => key !== 'DEFAULT')
      .map(([key, value]) => {
        return [key, designSystem.theme.resolveValue(key, ['--breakpoint']), value]
      })
      .filter(Boolean) as [string, string, string][]
    breakpoints.sort((a, z) => compareBreakpoints(a[1], z[1], 'asc'))

    for (let [key, , value] of breakpoints) {
      if (breakpointOverwrites && breakpointOverwrites.has(key)) {
        let overwrite = breakpointOverwrites.get(key)!
        overwrite.nodes.push(decl('padding-inline', value))
      } else if (breakpointOverwrites) {
        // The breakpoint does not exist in the overwritten breakpoints list, so
        // we skip rendering it.
        continue
      } else {
        rules.push(
          atRule('@media', `(width >= theme(--breakpoint-${key}))`, [
            decl('padding-inline', value),
          ]),
        )
      }
    }
  }

  if (breakpointOverwrites) {
    for (let [, rule] of breakpointOverwrites) {
      rules.push(rule)
    }
  }

  return rules
}
