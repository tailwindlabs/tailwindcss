import { rule } from '../ast'
import type { DesignSystem } from '../design-system'
import type { ResolvedConfig } from './config/types'
import DefaultTheme from './default-theme'

export function registerScreensConfig(config: ResolvedConfig, designSystem: DesignSystem) {
  let screens = config.theme.screens || {}

  // We want to insert the breakpoints in the right order as best we can. In the
  // core utility, all static breakpoint variants and the `min-*` functional
  // variant are registered inside a group. Since all the variants within a
  // group share the same order, we can use the always-defined `min-*` variant
  // as the order.
  let order = designSystem.variants.get('min')?.order ?? undefined

  // Case A: All theme config are simple (non-nested-object) values. This means
  // all breakpoints are used as `min` values, like we do in the core.

  // Step 1: Register static breakpoint variants for everything that comes from
  // the user theme config.
  for (let [name, value] of Object.entries(screens)) {
    let coreVariant = designSystem.variants.get(name)

    // Ignore defaults if they are already registered
    //
    // Note: We can't rely on the `designSystem.theme` for this, as it has the
    // JS config values applied already. However, the DefaultTheme might not
    // match what is actually already set in the designSystem since the @theme
    // is set at runtime.
    if (coreVariant && DefaultTheme.screens[name as 'sm'] === screens[name]) {
      continue
    }

    // Ignore it if there's a CSS value that takes precedence over the JS config
    // and the static utilities are already registered.
    //
    // This happens when a `@theme { }` block is used that overwrites all JS
    // config options. We rely on the resolution order of the Theme for
    // resolving this. If Theme has a different value, we know that this is not
    // coming from the JS plugin and thus we don't need to handle it explicitly.
    let cssValue = designSystem.theme.resolveValue(name, ['--breakpoint'])
    if (coreVariant && cssValue && cssValue !== value) {
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
      { order },
    )
  }

  //
}
