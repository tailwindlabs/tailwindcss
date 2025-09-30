import fs from 'node:fs/promises'
import path, { extname } from 'node:path'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { computeUtilitySignature } from '../../../../tailwindcss/src/signatures'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { spliceChangesIntoString, type StringChange } from '../../utils/splice-changes-into-string'
import { extractRawCandidates } from './candidates'
import { isSafeMigration } from './is-safe-migration'
import { migrateAutomaticVarInjection } from './migrate-automatic-var-injection'
import { migrateCamelcaseInNamedValue } from './migrate-camelcase-in-named-value'
import { migrateCanonicalizeCandidate } from './migrate-canonicalize-candidate'
import { migrateEmptyArbitraryValues } from './migrate-handle-empty-arbitrary-values'
import { migrateLegacyArbitraryValues } from './migrate-legacy-arbitrary-values'
import { migrateLegacyClasses } from './migrate-legacy-classes'
import { migrateMaxWidthScreen } from './migrate-max-width-screen'
import { migrateModernizeArbitraryValues } from './migrate-modernize-arbitrary-values'
import { migrateOptimizeModifier } from './migrate-optimize-modifier'
import { migratePrefix } from './migrate-prefix'
import { migrateSimpleLegacyClasses } from './migrate-simple-legacy-classes'
import { migrateVariantOrder } from './migrate-variant-order'

export type Migration = (
  designSystem: DesignSystem,
  userConfig: Config | null,
  rawCandidate: string,
) => string | Promise<string>

export const DEFAULT_MIGRATIONS: Migration[] = [
  migrateEmptyArbitraryValues, // sync, v3 → v4
  migratePrefix, // sync, v3 → v4
  migrateCanonicalizeCandidate, // sync, v4 (optimization, can probably be removed)
  migrateSimpleLegacyClasses, // sync, v3 → v4
  migrateCamelcaseInNamedValue, // sync, v3 → v4
  migrateLegacyClasses, // async, v3 → v4
  migrateMaxWidthScreen, // sync, v3 → v4
  migrateVariantOrder, // sync, v3 → v4, Has to happen before migrations that modify variants
  migrateAutomaticVarInjection, // sync, v3 → v4
  migrateLegacyArbitraryValues, // sync, v3 → v4 (could also consider it a v4 optimization)
  migrateModernizeArbitraryValues, // sync, v3 and v4 optimizations, split up?
  migrateOptimizeModifier, // sync, v4 (optimization)
]

let migrateCached = new DefaultMap<
  DesignSystem,
  DefaultMap<Config | null, DefaultMap<string, Promise<string>>>
>((designSystem) => {
  return new DefaultMap((userConfig) => {
    return new DefaultMap(async (rawCandidate) => {
      let original = rawCandidate

      for (let migration of DEFAULT_MIGRATIONS) {
        rawCandidate = await migration(designSystem, userConfig, rawCandidate)
      }

      // Canonicalize the final migrated candidate to its final form
      rawCandidate = designSystem.canonicalizeCandidates([rawCandidate]).pop()!

      // Verify that the candidate actually makes sense at all. E.g.: `duration`
      // is not a valid candidate, but it will parse because `duration-<number>`
      // exists.
      let signature = computeUtilitySignature.get(designSystem).get(rawCandidate)
      if (typeof signature !== 'string') return original

      return rawCandidate
    })
  })
})

export async function migrateCandidate(
  designSystem: DesignSystem,
  userConfig: Config | null,
  rawCandidate: string,
  // Location is only set when migrating a candidate from a source file
  location?: {
    contents: string
    start: number
    end: number
  },
): Promise<string> {
  // Skip this migration if we think that the migration is unsafe
  if (location && !isSafeMigration(rawCandidate, location, designSystem)) {
    return rawCandidate
  }

  return migrateCached.get(designSystem).get(userConfig).get(rawCandidate)
}

export default async function migrateContents(
  designSystem: DesignSystem,
  userConfig: Config | null,
  contents: string,
  extension: string,
): Promise<string> {
  let candidates = await extractRawCandidates(contents, extension)

  let changes: StringChange[] = []

  for (let { rawCandidate, start, end } of candidates) {
    let migratedCandidate = await migrateCandidate(designSystem, userConfig, rawCandidate, {
      contents,
      start,
      end,
    })

    if (migratedCandidate === rawCandidate) {
      continue
    }

    changes.push({
      start,
      end,
      replacement: migratedCandidate,
    })
  }

  return spliceChangesIntoString(contents, changes)
}

export async function migrate(designSystem: DesignSystem, userConfig: Config | null, file: string) {
  let fullPath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(
    fullPath,
    await migrateContents(designSystem, userConfig, contents, extname(file)),
  )
}
