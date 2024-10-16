import { rule, type Rule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'
import { objectToAst } from './plugin-api'

export function applyKeyframesToTheme(
  designSystem: DesignSystem,
  resolvedConfig: Pick<ResolvedConfig, 'theme'>,
  replacedThemeKeys: Set<string>,
) {
  for (let rule of keyframesToRules(resolvedConfig)) {
    designSystem.theme.addKeyframes(rule)
  }
}

export function keyframesToRules(resolvedConfig: Pick<ResolvedConfig, 'theme'>): Rule[] {
  let rules: Rule[] = []
  if ('keyframes' in resolvedConfig.theme) {
    for (let [name, keyframe] of Object.entries(resolvedConfig.theme.keyframes)) {
      rules.push(rule(`@keyframes ${name}`, objectToAst(keyframe as any)))
    }
  }
  return rules
}
