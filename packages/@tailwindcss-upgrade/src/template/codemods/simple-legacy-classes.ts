import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

// Classes that used to exist in Tailwind CSS v3, but do not exist in Tailwind
// CSS v4 anymore.
const LEGACY_CLASS_MAP = {
  'overflow-clip': 'text-clip',
  'overflow-ellipsis': 'text-ellipsis',
  'flex-grow': 'grow',
  'flex-grow-0': 'grow-0',
  'flex-shrink': 'shrink',
  'flex-shrink-0': 'shrink-0',
  'decoration-clone': 'box-decoration-clone',
  'decoration-slice': 'box-decoration-slice',

  shadow: 'shadow-sm',
  'shadow-sm': 'shadow-xs',
  'shadow-xs': 'shadow-2xs',

  'inset-shadow': 'inset-shadow-sm',
  'inset-shadow-sm': 'inset-shadow-xs',
  'inset-shadow-xs': 'inset-shadow-2xs',

  'drop-shadow': 'drop-shadow-sm',
  'drop-shadow-sm': 'drop-shadow-xs',

  rounded: 'rounded-sm',
  'rounded-sm': 'rounded-xs',

  blur: 'blur-sm',
  'blur-sm': 'blur-xs',

  'outline-none': 'outline-hidden',
}

const THEME_KEYS = {
  shadow: 'boxShadow',
  'shadow-sm': 'boxShadow',
  'shadow-xs': 'boxShadow',

  'drop-shadow': 'dropShadow',
  'drop-shadow-sm': 'dropShadow',

  rounded: 'borderRadius',
  'rounded-sm': 'borderRadius',

  blur: 'blur',
  'blur-sm': 'blur',
}

const SEEDED = new WeakSet<DesignSystem>()

export function simpleLegacyClasses(
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
): string {
  // Prepare design system with the unknown legacy classes
  if (!SEEDED.has(designSystem)) {
    for (let old in LEGACY_CLASS_MAP) {
      designSystem.utilities.static(old, () => [])
    }
    SEEDED.add(designSystem)
  }

  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.kind === 'static' && Object.hasOwn(LEGACY_CLASS_MAP, candidate.root)) {
      let themeKey = THEME_KEYS[candidate.root as keyof typeof THEME_KEYS]
      if (
        themeKey &&
        // Theme was overwritten
        (userConfig?.theme?.[themeKey] !== undefined ||
          // Theme extend was overwritten
          userConfig?.theme?.extend?.[themeKey] !== undefined)
      ) {
        continue
      }

      return printCandidate(designSystem, {
        ...candidate,
        root: LEGACY_CLASS_MAP[candidate.root as keyof typeof LEGACY_CLASS_MAP],
      })
    }
  }

  return rawCandidate
}
