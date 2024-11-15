import { decl } from '../ast'
import type { DesignSystem } from '../design-system'

export function registerLegacyUtilities(designSystem: DesignSystem) {
  for (let [value, direction] of [
    ['t', 'top'],
    ['tr', 'top right'],
    ['r', 'right'],
    ['br', 'bottom right'],
    ['b', 'bottom'],
    ['bl', 'bottom left'],
    ['l', 'left'],
    ['tl', 'top left'],
  ]) {
    designSystem.utilities.static(`bg-gradient-to-${value}`, () => [
      decl('--tw-gradient-position', `to ${direction} in oklch,`),
      decl('background-image', `linear-gradient(var(--tw-gradient-stops))`),
    ])
  }

  designSystem.utilities.functional('max-w-screen', (candidate) => {
    if (!candidate.value) return
    if (candidate.value.kind === 'arbitrary') return
    let value = designSystem.theme.resolve(candidate.value.value, ['--breakpoint'])
    if (!value) return
    return [decl('max-width', value)]
  })
}
