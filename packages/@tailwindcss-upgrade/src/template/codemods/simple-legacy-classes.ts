import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

// Classes that used to exist in Tailwind CSS v3, but do not exist in Tailwind
// CSS v4 anymore.
const LEGACY_CLASS_MAP = {
  'overflow-clip': 'text-clip',
  'overflow-ellipsis': 'text-ellipsis',
  'flex-grow-0': 'grow-0',
  'flex-shrink-0': 'shrink-0',
  'decoration-clone': 'box-decoration-clone',
  'decoration-slice': 'box-decoration-slice',
}

const SEEDED = new WeakSet<DesignSystem>()

export function simpleLegacyClasses(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  // Prepare design system with the legacy classes
  if (!SEEDED.has(designSystem)) {
    for (let old in LEGACY_CLASS_MAP) {
      designSystem.utilities.static(old, () => [])
    }
    SEEDED.add(designSystem)
  }

  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.kind === 'static' && Object.hasOwn(LEGACY_CLASS_MAP, candidate.root)) {
      return printCandidate(designSystem, {
        ...candidate,
        root: LEGACY_CLASS_MAP[candidate.root as keyof typeof LEGACY_CLASS_MAP],
      })
    }
  }

  return rawCandidate
}
