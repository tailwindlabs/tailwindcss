import fs from 'node:fs/promises'
import path, { extname } from 'node:path'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { spliceChangesIntoString, type StringChange } from '../../utils/splice-changes-into-string'
import { extractRawCandidates } from './candidates'
import { arbitraryValueToBareValue } from './codemods/migrate-arbitrary-value-to-bare-value'
import { automaticVarInjection } from './codemods/migrate-automatic-var-injection'
import { bgGradient } from './codemods/migrate-bg-gradient'
import { handleEmptyArbitraryValues } from './codemods/migrate-handle-empty-arbitrary-values'
import { important } from './codemods/migrate-important'
import { legacyArbitraryValues } from './codemods/migrate-legacy-arbitrary-values'
import { legacyClasses } from './codemods/migrate-legacy-classes'
import { maxWidthScreen } from './codemods/migrate-max-width-screen'
import { modernizeArbitraryValues } from './codemods/migrate-modernize-arbitrary-values'
import { prefix } from './codemods/migrate-prefix'
import { simpleLegacyClasses } from './codemods/migrate-simple-legacy-classes'
import { themeToVar } from './codemods/migrate-theme-to-var'
import { variantOrder } from './codemods/migrate-variant-order'

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
  handleEmptyArbitraryValues,
  prefix,
  important,
  bgGradient,
  simpleLegacyClasses,
  legacyClasses,
  maxWidthScreen,
  themeToVar,
  variantOrder, // Has to happen before migrations that modify variants
  automaticVarInjection,
  legacyArbitraryValues,
  arbitraryValueToBareValue,
  modernizeArbitraryValues,
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
