import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'

export function registerThemeVariantOverrides(config: ResolvedConfig, designSystem: DesignSystem) {
  let ariaVariants = config.theme.aria || {}
  let supportsVariants = config.theme.supports || {}
  let dataVariants = config.theme.data || {}

  if (Object.keys(ariaVariants).length > 0) {
    let coreAria = designSystem.variants.get('aria')
    let applyFn = coreAria?.applyFn
    let compounds = coreAria?.compounds
    designSystem.variants.functional(
      'aria',
      (ruleNode, variant) => {
        let value = variant.value
        if (value && value.kind === 'named' && value.value in ariaVariants) {
          return applyFn?.(ruleNode, {
            ...variant,
            value: { kind: 'arbitrary', value: ariaVariants[value.value] as string },
          })
        }
        return applyFn?.(ruleNode, variant)
      },
      { compounds },
    )
  }

  if (Object.keys(supportsVariants).length > 0) {
    let coreSupports = designSystem.variants.get('supports')
    let applyFn = coreSupports?.applyFn
    let compounds = coreSupports?.compounds
    designSystem.variants.functional(
      'supports',
      (ruleNode, variant) => {
        let value = variant.value
        if (value && value.kind === 'named' && value.value in supportsVariants) {
          return applyFn?.(ruleNode, {
            ...variant,
            value: { kind: 'arbitrary', value: supportsVariants[value.value] as string },
          })
        }
        return applyFn?.(ruleNode, variant)
      },
      { compounds },
    )
  }

  if (Object.keys(dataVariants).length > 0) {
    let coreData = designSystem.variants.get('data')
    let applyFn = coreData?.applyFn
    let compounds = coreData?.compounds
    designSystem.variants.functional(
      'data',
      (ruleNode, variant) => {
        let value = variant.value
        if (value && value.kind === 'named' && value.value in dataVariants) {
          return applyFn?.(ruleNode, {
            ...variant,
            value: { kind: 'arbitrary', value: dataVariants[value.value] as string },
          })
        }
        return applyFn?.(ruleNode, variant)
      },
      { compounds },
    )
  }
}
