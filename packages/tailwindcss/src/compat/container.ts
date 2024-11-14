import { atRule, decl, type AstNode } from '../ast'
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
  let breakpointOverwrites = new Map<string, AstNode[]>()

  if (center) {
    rules.push(decl('margin-inline', 'auto'))
  }

  if (typeof padding === 'string') {
    rules.push(decl('padding-inline', padding))
  }

  if (typeof screens === 'object' && screens !== null) {
    // When setting a the `screens` in v3, you were overwriting the default
    // screens config. To do this in v4, you have to manually unset all core
    // screens.

    let breakpoints = Array.from(designSystem.theme.namespace('--breakpoint').entries())
    breakpoints.sort((a, z) => compareBreakpoints(a[1], z[1], 'asc'))

    for (let [key] of breakpoints) {
      if (!key) continue
      if (!(key in screens)) {
        breakpointOverwrites.set(key, [decl('max-width', 'none')])
      }
    }

    for (let [key, value] of Object.entries(screens)) {
      let coreBreakpoint = breakpoints.find(([k]) => k === key)
      if (coreBreakpoint && value === coreBreakpoint[1]) {
        continue
      }
      breakpointOverwrites.set(key, [decl('max-width', `var(--breakpoint-${key})`)])
    }
  }

  if (typeof padding === 'object' && padding !== null) {
    if ('DEFAULT' in padding && typeof padding.DEFAULT === 'string') {
      rules.push(decl('padding-inline', padding.DEFAULT))
    }

    let breakpoints = Object.entries(padding)
      .filter(([key]) => key !== 'DEFAULT')
      .map(([key, value]) => {
        return [key, designSystem.theme.resolveValue(key, ['--breakpoint']), value]
      })
      .filter(Boolean) as [string, string, string][]
    breakpoints.sort((a, z) => compareBreakpoints(a[1], z[1], 'asc'))

    for (let [key, , value] of breakpoints) {
      let rules: AstNode[] = []
      if (breakpointOverwrites.has(key)) {
        rules = breakpointOverwrites.get(key)!
      }

      rules.push(decl('padding-inline', value))
      breakpointOverwrites.set(key, rules)
    }
  }

  for (let [key, value] of breakpointOverwrites) {
    rules.push(atRule('@media', `(width >= theme(--breakpoint-${key}))`, value))
  }

  return rules
}
