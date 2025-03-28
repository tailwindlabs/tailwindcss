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
    designSystem.utilities.static(`bg-gradient-to-${value}`, () => [
      decl('--tw-gradient-position', `to ${direction} in oklab`),
      decl('background-image', `linear-gradient(var(--tw-gradient-stops))`),
    ])
  }

  // Legacy `background-position` utilities for compatibility with v4.0 and earlier
  designSystem.utilities.static('bg-left-top', () => [decl('background-position', 'left top')])
  designSystem.utilities.static('bg-right-top', () => [decl('background-position', 'right top')])
  designSystem.utilities.static('bg-left-bottom', () => [
    decl('background-position', 'left bottom'),
  ])
  designSystem.utilities.static('bg-right-bottom', () => [
    decl('background-position', 'right bottom'),
  ])

  // Legacy `object-position` utilities for compatibility with v4.0 and earlier
  designSystem.utilities.static('object-left-top', () => [decl('object-position', 'left top')])
  designSystem.utilities.static('object-right-top', () => [decl('object-position', 'right top')])
  designSystem.utilities.static('object-left-bottom', () => [
    decl('object-position', 'left bottom'),
  ])
  designSystem.utilities.static('object-right-bottom', () => [
    decl('object-position', 'right bottom'),
  ])

  designSystem.utilities.functional('max-w-screen', (candidate) => {
    if (!candidate.value) return
    if (candidate.value.kind === 'arbitrary') return
    let value = designSystem.theme.resolve(candidate.value.value, ['--breakpoint'])
    if (!value) return
    return [decl('max-width', value)]
  })

  designSystem.utilities.static(`overflow-ellipsis`, () => [decl('text-overflow', `ellipsis`)])

  designSystem.utilities.static(`decoration-slice`, () => [
    decl('-webkit-box-decoration-break', `slice`),
    decl('box-decoration-break', `slice`),
  ])

  designSystem.utilities.static(`decoration-clone`, () => [
    decl('-webkit-box-decoration-break', `clone`),
    decl('box-decoration-break', `clone`),
  ])

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
}
