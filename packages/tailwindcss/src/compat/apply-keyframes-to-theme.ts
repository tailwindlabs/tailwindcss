import { rule, type Rule } from '../ast'
import type { DesignSystem } from '../design-system'
import { ThemeOptions } from '../theme'
import type { ResolvedConfig } from './config/types'
import { objectToAst } from './plugin-api'

export function applyKeyframesToTheme(
  designSystem: DesignSystem,
  resolvedConfig: Pick<ResolvedConfig, 'theme'>,
  resetThemeKeys: Set<string>,
) {
  if (resetThemeKeys.has('keyframes')) {
    designSystem.theme.clearKeyframes(ThemeOptions.DEFAULT)
  }

  for (let rule of keyframesToRules(resolvedConfig)) {
    designSystem.theme.addKeyframe(rule)
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
