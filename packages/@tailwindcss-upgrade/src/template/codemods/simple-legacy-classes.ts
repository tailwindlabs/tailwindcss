import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import path from 'node:path'
import url from 'node:url'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  shadow: '--shadow',
  'shadow-sm': '--shadow-sm',
  'shadow-xs': '--shadow-xs',
  'shadow-2xs': '--shadow-2xs',

  'drop-shadow': '--drop-shadow',
  'drop-shadow-sm': '--drop-shadow-sm',

  rounded: '--radius',
  'rounded-sm': '--radius-sm',
  'rounded-xs': '--radius-xs',

  blur: '--blur',
  'blur-sm': '--blur-sm',
  'blur-xs': '--blur-xs',
}

const SEEDED = new WeakSet<DesignSystem>()

export async function simpleLegacyClasses(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
): Promise<string> {
  // Prepare design system with the unknown legacy classes
  if (!SEEDED.has(designSystem)) {
    for (let old in LEGACY_CLASS_MAP) {
      designSystem.utilities.static(old, () => [])
    }
    SEEDED.add(designSystem)
  }

  let defaultDesignSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', {
    base: __dirname,
  })

  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    if (candidate.kind === 'static' && Object.hasOwn(LEGACY_CLASS_MAP, candidate.root)) {
      let fromThemeKey = THEME_KEYS[candidate.root as keyof typeof THEME_KEYS]
      let toThemeKey =
        THEME_KEYS[
          LEGACY_CLASS_MAP[
            candidate.root as keyof typeof LEGACY_CLASS_MAP
          ] as keyof typeof THEME_KEYS
        ]

      // Migrating something that resolves to a value in the theme.
      if (fromThemeKey && toThemeKey) {
        let customFrom = designSystem.resolveThemeValue(fromThemeKey)
        let defaultFrom = defaultDesignSystem.resolveThemeValue(fromThemeKey)
        let customTo = designSystem.resolveThemeValue(toThemeKey)
        let defaultTo = defaultDesignSystem.resolveThemeValue(toThemeKey)

        // The new theme value is not defined, which means we can't safely migrate
        // the utility.
        if (customTo === undefined) {
          continue
        }

        // The "from" theme value changed compared to the default theme value.
        if (customFrom !== defaultFrom) {
          continue
        }

        // The "to" theme value changed compared to the default theme value.
        if (customTo !== defaultTo) {
          continue
        }
      }

      return printCandidate(designSystem, {
        ...candidate,
        root: LEGACY_CLASS_MAP[candidate.root as keyof typeof LEGACY_CLASS_MAP],
      })
    }
  }

  return rawCandidate
}
