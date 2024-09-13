import { rule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'
import DefaultTheme from './default-theme'

export function registerScreensConfig(config: ResolvedConfig, designSystem: DesignSystem) {
  let screens = config.theme.screens || {}

  // Case 1: All theme config are simple (non-nested-object) values. This means
  // all breakpoints are used as `min` values, like we do in the core.
  for (let [name, value] of Object.entries(screens)) {
    // Ignore defaults
    if (DefaultTheme.screens[name as 'sm'] === screens[name]) continue

    let coreVariant = designSystem.variants.get(name)
    if (!coreVariant) {
      throw new Error('not yet supported, needs more thought')
    }

    // min-${breakpoint} and max-${breakpoint} rules do not need to be
    // reconfigured, as they are using functional utilities and will not eagerly
    // capture the breakpoints before the compat layer runs.
    designSystem.variants.static(
      name,
      (ruleNode) => {
        ruleNode.nodes = [rule(`@media (width >= ${value})`, ruleNode.nodes)]
      },
      { order: coreVariant.order },
    )
  }
}
