import fs from 'node:fs/promises'
import path, { extname } from 'node:path'
import { parseCandidate } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { spliceChangesIntoString, type StringChange } from '../../utils/splice-changes-into-string'
import { extractRawCandidates } from './candidates'
import { migrateArbitraryUtilities } from './migrate-arbitrary-utilities'
import { migrateArbitraryValueToBareValue } from './migrate-arbitrary-value-to-bare-value'
import { migrateArbitraryVariants } from './migrate-arbitrary-variants'
import { migrateAutomaticVarInjection } from './migrate-automatic-var-injection'
import { migrateBareValueUtilities } from './migrate-bare-utilities'
import { migrateBgGradient } from './migrate-bg-gradient'
import { migrateDropUnnecessaryDataTypes } from './migrate-drop-unnecessary-data-types'
import { migrateEmptyArbitraryValues } from './migrate-handle-empty-arbitrary-values'
import { migrateImportant } from './migrate-important'
import { migrateLegacyArbitraryValues } from './migrate-legacy-arbitrary-values'
import { migrateLegacyClasses } from './migrate-legacy-classes'
import { migrateMaxWidthScreen } from './migrate-max-width-screen'
import { migrateModernizeArbitraryValues } from './migrate-modernize-arbitrary-values'
import { migrateOptimizeModifier } from './migrate-optimize-modifier'
import { migratePrefix } from './migrate-prefix'
import { migrateSimpleLegacyClasses } from './migrate-simple-legacy-classes'
import { migrateThemeToVar } from './migrate-theme-to-var'
import { migrateVariantOrder } from './migrate-variant-order'

export type Migration = (
  designSystem: DesignSystem,
  userConfig: Config | null,
  rawCandidate: string,
  location?: {
    contents: string
    start: number
    end: number
  },
) => string | Promise<string>

export const DEFAULT_MIGRATIONS: Migration[] = [
  migrateEmptyArbitraryValues,
  migratePrefix,
  migrateImportant,
  migrateBgGradient,
  migrateSimpleLegacyClasses,
  migrateLegacyClasses,
  migrateMaxWidthScreen,
  migrateThemeToVar,
  migrateVariantOrder, // Has to happen before migrations that modify variants
  migrateAutomaticVarInjection,
  migrateLegacyArbitraryValues,
  migrateArbitraryUtilities,
  migrateBareValueUtilities,
  migrateModernizeArbitraryValues,
  migrateArbitraryVariants,
  migrateDropUnnecessaryDataTypes,
  migrateArbitraryValueToBareValue,
  migrateOptimizeModifier,
]

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
  let original = rawCandidate
  for (let migration of DEFAULT_MIGRATIONS) {
    rawCandidate = await migration(designSystem, userConfig, rawCandidate, location)
  }

  // If nothing changed, let's parse it again and re-print it. This will migrate
  // pretty print candidates to the new format. If it did change, we already had
  // to re-print it.
  //
  // E.g.: `bg-red-500/[var(--my-opacity)]` -> `bg-red-500/(--my-opacity)`
  if (rawCandidate === original) {
    for (let candidate of parseCandidate(rawCandidate, designSystem)) {
      return designSystem.printCandidate(candidate)
    }
  }

  return rawCandidate
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
