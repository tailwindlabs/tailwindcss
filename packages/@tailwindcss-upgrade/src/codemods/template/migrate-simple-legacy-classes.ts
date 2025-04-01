import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from './candidates'

// Classes that used to exist in Tailwind CSS v3, but do not exist in Tailwind
// CSS v4 anymore.
const LEGACY_CLASS_MAP = {
  'overflow-ellipsis': 'text-ellipsis',

  'flex-grow': 'grow',
  'flex-grow-0': 'grow-0',
  'flex-shrink': 'shrink',
  'flex-shrink-0': 'shrink-0',

  'decoration-clone': 'box-decoration-clone',
  'decoration-slice': 'box-decoration-slice',

  'outline-none': 'outline-hidden',
}

let seenDesignSystems = new WeakSet<DesignSystem>()

export function migrateSimpleLegacyClasses(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): string {
  // Prepare design system with the unknown legacy classes
  if (!seenDesignSystems.has(designSystem)) {
    for (let old in LEGACY_CLASS_MAP) {
      designSystem.utilities.static(old, () => [])
    }
    seenDesignSystems.add(designSystem)
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
