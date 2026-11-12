import { atRule, type AtRule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'
import { objectToAst, type CssInJsSources } from './plugin-api'

export function applyKeyframesToTheme(
  designSystem: DesignSystem,
  resolvedConfig: Pick<ResolvedConfig, 'theme'>,
  sources?: CssInJsSources,
) {
  for (let rule of keyframesToRules(resolvedConfig, sources)) {
    designSystem.theme.addKeyframes(rule)
  }
}

export function keyframesToRules(
  resolvedConfig: Pick<ResolvedConfig, 'theme'>,
  sources?: CssInJsSources,
): AtRule[] {
  let rules: AtRule[] = []
  if ('keyframes' in resolvedConfig.theme) {
    for (let [name, keyframe] of Object.entries(resolvedConfig.theme.keyframes)) {
      let rule = atRule('@keyframes', name, objectToAst(keyframe as any, sources))
      rule.src = sources?.get(resolvedConfig.theme.keyframes)?.get(name)
      rules.push(rule)
    }
  }
  return rules
}
