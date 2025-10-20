import { decl } from '../ast'
import type { DesignSystem } from '../design-system'
import { isPositiveInteger } from '../utils/infer-data-type'

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
    designSystem.utilities.suggest(`bg-gradient-to-${value}`, () => [])
    designSystem.utilities.static(`bg-gradient-to-${value}`, () => [
      decl('--tw-gradient-position', `to ${direction} in oklab`),
      decl('background-image', `linear-gradient(var(--tw-gradient-stops))`),
    ])
  }

  // Legacy `background-position` utilities for compatibility with v4.0 and earlier
  designSystem.utilities.suggest('bg-left-top', () => [])
  designSystem.utilities.static('bg-left-top', () => [decl('background-position', 'left top')])
  designSystem.utilities.suggest('bg-right-top', () => [])
  designSystem.utilities.static('bg-right-top', () => [decl('background-position', 'right top')])
  designSystem.utilities.suggest('bg-left-bottom', () => [])
  designSystem.utilities.static('bg-left-bottom', () => [
    decl('background-position', 'left bottom'),
  ])
  designSystem.utilities.suggest('bg-right-bottom', () => [])
  designSystem.utilities.static('bg-right-bottom', () => [
    decl('background-position', 'right bottom'),
  ])

  // Legacy `object-position` utilities for compatibility with v4.0 and earlier
  designSystem.utilities.suggest('object-left-top', () => [])
  designSystem.utilities.static('object-left-top', () => [decl('object-position', 'left top')])
  designSystem.utilities.suggest('object-right-top', () => [])
  designSystem.utilities.static('object-right-top', () => [decl('object-position', 'right top')])
  designSystem.utilities.suggest('object-left-bottom', () => [])
  designSystem.utilities.static('object-left-bottom', () => [
    decl('object-position', 'left bottom'),
  ])
  designSystem.utilities.suggest('object-right-bottom', () => [])
  designSystem.utilities.static('object-right-bottom', () => [
    decl('object-position', 'right bottom'),
  ])

  designSystem.utilities.suggest('max-w-screen', () => [])
  designSystem.utilities.functional('max-w-screen', (candidate) => {
    if (!candidate.value) return
    if (candidate.value.kind === 'arbitrary') return
    let value = designSystem.theme.resolve(candidate.value.value, ['--breakpoint'])
    if (!value) return
    return [decl('max-width', value)]
  })

  designSystem.utilities.suggest('overflow-ellipsis', () => [])
  designSystem.utilities.static(`overflow-ellipsis`, () => [decl('text-overflow', `ellipsis`)])

  designSystem.utilities.suggest('decoration-slice', () => [])
  designSystem.utilities.static(`decoration-slice`, () => [
    decl('-webkit-box-decoration-break', `slice`),
    decl('box-decoration-break', `slice`),
  ])

  designSystem.utilities.suggest('decoration-clone', () => [])
  designSystem.utilities.static(`decoration-clone`, () => [
    decl('-webkit-box-decoration-break', `clone`),
    decl('box-decoration-break', `clone`),
  ])

  designSystem.utilities.suggest('flex-shrink', () => [])
  designSystem.utilities.functional('flex-shrink', (candidate) => {
    if (candidate.modifier) return

    if (!candidate.value) {
      return [decl('flex-shrink', '1')]
    }

    if (candidate.value.kind === 'arbitrary') {
      return [decl('flex-shrink', candidate.value.value)]
    }

    if (isPositiveInteger(candidate.value.value)) {
      return [decl('flex-shrink', candidate.value.value)]
    }
  })

  designSystem.utilities.suggest('flex-grow', () => [])
  designSystem.utilities.functional('flex-grow', (candidate) => {
    if (candidate.modifier) return

    if (!candidate.value) {
      return [decl('flex-grow', '1')]
    }

    if (candidate.value.kind === 'arbitrary') {
      return [decl('flex-grow', candidate.value.value)]
    }

    if (isPositiveInteger(candidate.value.value)) {
      return [decl('flex-grow', candidate.value.value)]
    }
  })

  designSystem.utilities.suggest('order-none', () => [])
  designSystem.utilities.static('order-none', () => [decl('order', '0')])

  designSystem.utilities.suggest('break-words', () => [])
  designSystem.utilities.static('break-words', () => [decl('overflow-wrap', 'break-word')])
}
