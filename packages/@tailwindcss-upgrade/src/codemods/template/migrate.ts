import fs from 'node:fs/promises'
import path, { extname } from 'node:path'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { spliceChangesIntoString, type StringChange } from '../../utils/splice-changes-into-string'
import { extractRawCandidates } from './candidates'
import { isSafeMigration } from './is-safe-migration'
import { migrateArbitraryUtilities } from './migrate-arbitrary-utilities'
import { migrateArbitraryValueToBareValue } from './migrate-arbitrary-value-to-bare-value'
import { migrateArbitraryVariants } from './migrate-arbitrary-variants'
import { migrateAutomaticVarInjection } from './migrate-automatic-var-injection'
import { migrateBareValueUtilities } from './migrate-bare-utilities'
import { migrateBgGradient } from './migrate-bg-gradient'
import { migrateCamelcaseInNamedValue } from './migrate-camelcase-in-named-value'
import { migrateCanonicalizeCandidate } from './migrate-canonicalize-candidate'
import { migrateDeprecatedUtilities } from './migrate-deprecated-utilities'
import { migrateDropUnnecessaryDataTypes } from './migrate-drop-unnecessary-data-types'
import { migrateEmptyArbitraryValues } from './migrate-handle-empty-arbitrary-values'
import { migrateLegacyArbitraryValues } from './migrate-legacy-arbitrary-values'
import { migrateLegacyClasses } from './migrate-legacy-classes'
import { migrateMaxWidthScreen } from './migrate-max-width-screen'
import { migrateModernizeArbitraryValues } from './migrate-modernize-arbitrary-values'
import { migrateOptimizeModifier } from './migrate-optimize-modifier'
import { migratePrefix } from './migrate-prefix'
import { migrateSimpleLegacyClasses } from './migrate-simple-legacy-classes'
import { migrateThemeToVar } from './migrate-theme-to-var'
import { migrateVariantOrder } from './migrate-variant-order'
import { computeUtilitySignature } from './signatures'

export type Migration = (
  designSystem: DesignSystem,
  userConfig: Config | null,
  rawCandidate: string,
) => string | Promise<string>

export const DEFAULT_MIGRATIONS: Migration[] = [
  migrateEmptyArbitraryValues,
  migratePrefix,
  migrateCanonicalizeCandidate,
  migrateBgGradient,
  migrateSimpleLegacyClasses,
  migrateCamelcaseInNamedValue,
  migrateLegacyClasses,
  migrateMaxWidthScreen,
  migrateThemeToVar,
  migrateVariantOrder, // Has to happen before migrations that modify variants
  migrateAutomaticVarInjection,
  migrateLegacyArbitraryValues,
  migrateArbitraryUtilities,
  migrateBareValueUtilities,
  migrateDeprecatedUtilities,
  migrateModernizeArbitraryValues,
  migrateArbitraryVariants,
  migrateDropUnnecessaryDataTypes,
  migrateArbitraryValueToBareValue,
  migrateOptimizeModifier,
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
