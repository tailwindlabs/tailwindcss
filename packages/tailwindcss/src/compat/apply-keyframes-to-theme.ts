import { atRule, type AtRule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { SourceLocation } from '../source-maps/source'
import { walk } from '../walk'
import type { ResolvedConfig } from './config/types'
import { objectToAst } from './plugin-api'

export function applyKeyframesToTheme(
  designSystem: DesignSystem,
  resolvedConfig: Pick<ResolvedConfig, 'theme'>,
  sources?: ReadonlyMap<string, SourceLocation | undefined>,
) {
  for (let rule of keyframesToRules(resolvedConfig)) {
    let src = sources?.get(rule.params)
    if (src) {
      walk([rule], (node) => {
        node.src = src
      })
    }
    designSystem.theme.addKeyframes(rule)
  }
}

export function keyframesToRules(resolvedConfig: Pick<ResolvedConfig, 'theme'>): AtRule[] {
  let rules: AtRule[] = []
  if ('keyframes' in resolvedConfig.theme) {
    for (let [name, keyframe] of Object.entries(resolvedConfig.theme.keyframes)) {
      rules.push(atRule('@keyframes', name, objectToAst(keyframe as any)))
    }
  }
  return rules
}
