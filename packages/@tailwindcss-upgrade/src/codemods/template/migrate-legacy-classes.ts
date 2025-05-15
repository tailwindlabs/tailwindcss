import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import path from 'node:path'
import url from 'node:url'
import type { Candidate } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import * as version from '../../utils/version'
import { baseCandidate } from './candidates'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LEGACY_CLASS_MAP = new Map([
  ['shadow', 'shadow-sm'],
  ['shadow-sm', 'shadow-xs'],
  ['shadow-xs', 'shadow-2xs'],

  ['inset-shadow', 'inset-shadow-sm'],
  ['inset-shadow-sm', 'inset-shadow-xs'],
  ['inset-shadow-xs', 'inset-shadow-2xs'],

  ['drop-shadow', 'drop-shadow-sm'],
  ['drop-shadow-sm', 'drop-shadow-xs'],

  ['rounded', 'rounded-sm'],
  ['rounded-sm', 'rounded-xs'],

  ['blur', 'blur-sm'],
  ['blur-sm', 'blur-xs'],

  ['backdrop-blur', 'backdrop-blur-sm'],
  ['backdrop-blur-sm', 'backdrop-blur-xs'],

  ['ring', 'ring-3'],

  ['outline', 'outline-solid'],
])

const THEME_KEYS = new Map([
  ['shadow', '--shadow'],
  ['shadow-sm', '--shadow-sm'],
  ['shadow-xs', '--shadow-xs'],
  ['shadow-2xs', '--shadow-2xs'],

  ['drop-shadow', '--drop-shadow'],
  ['drop-shadow-sm', '--drop-shadow-sm'],
  ['drop-shadow-xs', '--drop-shadow-xs'],

  ['rounded', '--radius'],
  ['rounded-sm', '--radius-sm'],
  ['rounded-xs', '--radius-xs'],

  ['blur', '--blur'],
  ['blur-sm', '--blur-sm'],
  ['blur-xs', '--blur-xs'],

  ['backdrop-blur', '--backdrop-blur'],
  ['backdrop-blur-sm', '--backdrop-blur-sm'],
  ['backdrop-blur-xs', '--backdrop-blur-xs'],

  ['ring', '--ring-width'],
  ['ring-3', '--ring-width-3'],
])

const DESIGN_SYSTEMS = new DefaultMap((base) => {
  return __unstable__loadDesignSystem('@import "tailwindcss";', { base })
})

export async function migrateLegacyClasses(
  designSystem: DesignSystem,
  _userConfig: Config | null,
  rawCandidate: string,
): Promise<string> {
  // These migrations are only safe when migrating from v3 to v4.
  //
  // Migrating from `rounded` to `rounded-sm` once is fine (v3 -> v4). But if we
  // migrate again (v4 -> v4), then `rounded-sm` would be migrated to
  // `rounded-xs` which is incorrect because we already migrated this.
  if (!version.isMajor(3)) {
    return rawCandidate
  }

  let defaultDesignSystem = await DESIGN_SYSTEMS.get(__dirname)

  function* migrate(rawCandidate: string) {
    for (let candidate of designSystem.parseCandidate(rawCandidate)) {
      // Create a base candidate string from the candidate.
      // E.g.: `hover:blur!` -> `blur`
      let base = baseCandidate(candidate)
      let baseCandidateString = designSystem.printCandidate(base)

      // Find the new base candidate string. `blur` -> `blur-sm`
      let newBaseCandidateString = LEGACY_CLASS_MAP.get(baseCandidateString)
      if (!newBaseCandidateString) continue

      // Parse the new base candidate string into an actual candidate AST.
      let [newBaseCandidate] = designSystem.parseCandidate(newBaseCandidateString)
      if (!newBaseCandidate) continue

      // Re-apply the variants and important flag from the original candidate.
      // E.g.: `hover:blur!` -> `blur` -> `blur-sm` -> `hover:blur-sm!`
      let newCandidate = structuredClone(newBaseCandidate) as Candidate
      newCandidate.variants = candidate.variants
      newCandidate.important = candidate.important

      yield [
        newCandidate,
        THEME_KEYS.get(baseCandidateString),
        THEME_KEYS.get(newBaseCandidateString),
      ] as const
    }
  }

  for (let [toCandidate, fromThemeKey, toThemeKey] of migrate(rawCandidate)) {
    if (fromThemeKey && toThemeKey) {
      // Migrating something that resolves to a value in the theme.
      let customFrom = designSystem.resolveThemeValue(fromThemeKey, true)
      let defaultFrom = defaultDesignSystem.resolveThemeValue(fromThemeKey, true)
      let customTo = designSystem.resolveThemeValue(toThemeKey, true)
      let defaultTo = defaultDesignSystem.resolveThemeValue(toThemeKey)

      // The new theme value is not defined, which means we can't safely
      // migrate the utility.
      if (customTo === undefined && defaultTo !== undefined) {
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

    return designSystem.printCandidate(toCandidate)
  }

  return rawCandidate
}
