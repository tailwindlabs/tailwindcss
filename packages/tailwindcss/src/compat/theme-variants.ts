import { rule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'
import DefaultTheme from './default-theme'

export function registerThemeVariantOverrides(config: ResolvedConfig, designSystem: DesignSystem) {
  let ariaVariants = config.theme.aria || {}
  let supportsVariants = config.theme.supports || {}
  let dataVariants = config.theme.data || {}

  for (let [name, rule] of Object.entries(DefaultTheme.aria)) {
    // `theme.aria` contains values from the default theme. We don't
    // want to create variants for these values as these are already
    // handled by the core utility.
    if (ariaVariants[name] === rule) {
      delete ariaVariants[name]
    }
  }

  for (let [name, rule] of Object.entries(DefaultTheme.aria)) {
    if (ariaVariants[name] === rule) {
      delete ariaVariants[name]
    }
  }

  if (Object.keys(ariaVariants).length > 0) {
    let coreAria = designSystem.variants.get('aria')
    let coreApplyFn = coreAria?.applyFn
    let coreCompounds = coreAria?.compounds
    designSystem.variants.functional(
      'aria',
      (ruleNode, variant) => {
        let value = variant.value
        if (value && value.kind === 'named' && value.value in ariaVariants) {
          ruleNode.nodes = [rule(`&[aria-${ariaVariants[value.value]}]`, ruleNode.nodes)]
          return
        }
        return coreApplyFn?.(ruleNode, variant)
      },
      { compounds: coreCompounds },
    )
  }

  if (Object.keys(supportsVariants).length > 0) {
    let coreSupports = designSystem.variants.get('supports')
    let coreApplyFn = coreSupports?.applyFn
    let coreCompounds = coreSupports?.compounds
    designSystem.variants.functional(
      'supports',
      (ruleNode, variant) => {
        let value = variant.value
        if (value && value.kind === 'named' && value.value in supportsVariants) {
          ruleNode.nodes = [rule(`@supports (${supportsVariants[value.value]})`, ruleNode.nodes)]
          return
        }
        return coreApplyFn?.(ruleNode, variant)
      },
      { compounds: coreCompounds },
    )
  }

  if (Object.keys(dataVariants).length > 0) {
    let coreData = designSystem.variants.get('data')
    let coreApplyFn = coreData?.applyFn
    let coreCompounds = coreData?.compounds
    designSystem.variants.functional(
      'data',
      (ruleNode, variant) => {
        let value = variant.value
        if (value && value.kind === 'named' && value.value in dataVariants) {
          ruleNode.nodes = [rule(`&[data-${dataVariants[value.value]}]`, ruleNode.nodes)]
          return
        }
        return coreApplyFn?.(ruleNode, variant)
      },
      { compounds: coreCompounds },
    )
  }
}
