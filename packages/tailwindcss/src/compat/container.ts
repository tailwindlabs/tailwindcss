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
  let breakpointOverwrites: null | Map<string, { nodes: AstNode[]; rule: string }> = null

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

    let didUnsetPreviousRange = false
    for (let [key, value] of breakpoints) {
      // If we happen to find a `--breakpoint-*` variable with the same key and
      // value, it will already be part of the core utility and we can skip it.
      if (!key) continue
      if (key in screens && (screens as Record<string, string>)[key] === value) {
        if (didUnsetPreviousRange) {
          rules.push(
            atRule('@media', `(width >= theme(--breakpoint-${key}))`, [
              decl('max-width', `var(--breakpoint-${key})`),
            ]),
          )
          didUnsetPreviousRange = false
        }

        breakpointOverwrites.set(key, {
          rule: `(width >= ${value})`,
          nodes: [],
        })
        continue
      }

      if (!didUnsetPreviousRange) {
        // We do not want to collect this core breakpoint in the `breakpointOverwrites`
        // map, since it will not be relevant for subsequent
        rules.push(
          atRule('@media', `(width >= theme(--breakpoint-${key}))`, [decl('max-width', 'none')]),
        )
        didUnsetPreviousRange = true
      }
    }

    for (let [key, value] of Object.entries(screens)) {
      // If we happen to find a `--breakpoint-*` variable with the same key and
      // value, it will already be part of the core utility and we can skip it.
      let coreBreakpoint = breakpoints.find(([k]) => k === key)
      if (coreBreakpoint && value === coreBreakpoint[1]) {
        continue
      }

      // We're inlining the breakpoint values because the screens configured in
      // the `container` option do not have to match the ones defined in the
      // root `screen` setting.
      breakpointOverwrites.set(key, {
        rule: `(width >= ${value})`,
        nodes: [decl('max-width', value)],
      })
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
    for (let [, { rule, nodes }] of breakpointOverwrites) {
      if (nodes.length > 0) rules.push(atRule('@media', rule, nodes))
    }
  }

  return rules
}
