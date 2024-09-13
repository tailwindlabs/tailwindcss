import { rule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'
import DefaultTheme from './default-theme'

export function registerScreensConfig(config: ResolvedConfig, designSystem: DesignSystem) {
  let screens = config.theme.screens || {}

  // We want to insert the breakpoints in the right order as best we can, we
  // know that the `max` functional variant is added before all min variants, so
  // we use this as our lower bound.
  let lastKnownOrder = designSystem.variants.get('max')?.order ?? 0

  // Case 1: All theme config are simple (non-nested-object) values. This means
  // all breakpoints are used as `min` values, like we do in the core.
  for (let [name, value] of Object.entries(screens)) {
    let coreVariant = designSystem.variants.get(name)

    // Ignore defaults, but update the order accordingly
    //
    // Note: We can't rely on the `designSystem.theme` for this, as it has the
    // JS config values applied already.
    if (DefaultTheme.screens[name as 'sm'] === screens[name]) {
      if (coreVariant) lastKnownOrder = coreVariant.order
      continue
    }

    // Ignore it if there's a CSS value that takes precedence over the JS config
    //
    // This happens when a `@theme { }` block is used that overwrites all JS
    // config options. We rely on the order inside the Theme for resolving this.
    // If Theme has a different value, we know that this is not coming from the
    // JS plugin and thus we don't need to handle it explicitly.
    let cssValue = designSystem.theme.resolveValue(name, ['--breakpoint'])
    if (cssValue && cssValue !== value) {
      if (coreVariant) lastKnownOrder = coreVariant.order
      continue
    }

    // min-${breakpoint} and max-${breakpoint} rules do not need to be
    // reconfigured, as they are using functional utilities and will not eagerly
    // capture the breakpoints before the compat layer runs.
    designSystem.variants.static(
      name,
      (ruleNode) => {
        ruleNode.nodes = [rule(`@media (width >= ${value})`, ruleNode.nodes)]
      },
      { order: lastKnownOrder },
    )
  }
}
