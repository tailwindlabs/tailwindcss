import fs from 'node:fs/promises'
import path, { extname } from 'node:path'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { spliceChangesIntoString, type StringChange } from '../../utils/splice-changes-into-string'
import { extractRawCandidates } from './candidates'
import { migrateArbitraryValueToBareValue } from './migrate-arbitrary-value-to-bare-value'
import { migrateAutomaticVarInjection } from './migrate-automatic-var-injection'
import { migrateBgGradient } from './migrate-bg-gradient'
import { migrateEmptyArbitraryValues } from './migrate-handle-empty-arbitrary-values'
import { migrateImportant } from './migrate-important'
import { migrateLegacyArbitraryValues } from './migrate-legacy-arbitrary-values'
import { migrateLegacyClasses } from './migrate-legacy-classes'
import { migrateMaxWidthScreen } from './migrate-max-width-screen'
import { migrateModernizeArbitraryValues } from './migrate-modernize-arbitrary-values'
import { migratePrefix } from './migrate-prefix'
import { migrateSimpleLegacyClasses } from './migrate-simple-legacy-classes'
import { migrateThemeToVar } from './migrate-theme-to-var'
import { migrateVariantOrder } from './migrate-variant-order'

export type Migration = (
  designSystem: DesignSystem,
  userConfig: Config,
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
  migrateArbitraryValueToBareValue,
  migrateModernizeArbitraryValues,
]

export async function migrateCandidate(
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
  // Location is only set when migrating a candidate from a source file
  location?: {
    contents: string
    start: number
    end: number
  },
): Promise<string> {
  for (let migration of DEFAULT_MIGRATIONS) {
    rawCandidate = await migration(designSystem, userConfig, rawCandidate, location)
  }
  return rawCandidate
}

export default async function migrateContents(
  designSystem: DesignSystem,
  userConfig: Config,
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

export async function migrate(designSystem: DesignSystem, userConfig: Config, file: string) {
  let fullPath = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(
    fullPath,
    await migrateContents(designSystem, userConfig, contents, extname(file)),
  )
}
