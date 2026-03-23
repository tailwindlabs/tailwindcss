import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path, { extname } from 'node:path'
import {
  createSignatureOptions,
  prepareDesignSystemStorage,
  UTILITY_SIGNATURE_KEY,
} from '../../../../tailwindcss/src/canonicalize-candidates'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
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
import { migratePrefix } from './migrate-prefix'
import { migrateSimpleLegacyClasses } from './migrate-simple-legacy-classes'
import { migrateVariantOrder } from './migrate-variant-order'

export type Migration = (
  designSystem: DesignSystem,
  userConfig: Config | null,
  rawCandidate: string,
) => string | Promise<string>

export const DEFAULT_MIGRATIONS: Migration[] = [
  migrateEmptyArbitraryValues,
  migratePrefix,
  migrateCanonicalizeCandidate,
  migrateSimpleLegacyClasses,
  migrateCamelcaseInNamedValue,
  migrateLegacyClasses,
  migrateMaxWidthScreen,
  migrateVariantOrder, // Has to happen before migrations that modify variants
  migrateAutomaticVarInjection,
  migrateLegacyArbitraryValues,
  migrateModernizeArbitraryValues,
]

let migrateCached = new DefaultMap((baseDesignSystem: DesignSystem) => {
  let designSystem = prepareDesignSystemStorage(baseDesignSystem)
  let options = createSignatureOptions(designSystem)

  return new DefaultMap((userConfig: Config | null) => {
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
      let signature = designSystem.storage[UTILITY_SIGNATURE_KEY].get(options).get(rawCandidate)
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

  let migrated = await migrateContents(designSystem, userConfig, contents, extname(file))
  if (migrated === contents) return // Nothing changed
  if (migrated.trim() === '') return // Emptied out, something went horribly wrong

  await writeFileSafely(fullPath, migrated)
}

async function writeFileSafely(file: string, contents: string) {
  // Start by creating a new file in the current directory that is guaranteed to
  // be unique (via `uuid`). We can embed the `process.id` in case we need to
  // debug things later.
  //
  // While we can write this to a more global `/tmp` folder, I want to be 100%
  // sure that we are on the same file system (same drive) so the rename
  // operation is atomic. Once the file is written, we will rename the file. If
  // this fails, the old file is still intact, if it works we have an updated
  // file.
  //
  // If this still causes problems (but it will slow things down):
  // 1. We could make sure that we inherit the file permissions
  // 2. Use an explicit fsync to force a flush to disk
  let temporaryFile = path.join(
    path.dirname(file),
    `.${path.basename(file)}.tailwind-upgrade.${process.pid}.${randomUUID()}.tmp`,
  )

  // Write file uses the `w` flag by default, which is defined as:
  // > Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
  // > https://nodejs.org/api/fs.html#file-system-flags
  //
  // Which means that if this function is actively running, and you cancel the
  // process at the wrong time, then the truncated files are present. Since all
  // these migrations happen in parallel, multiple files are open and available
  // to be written to, it could mean in multiple truncated files.
  //
  // Writing to a temp file first means that if the process is cancelled at this
  // point, that the old original file is still correct.
  //
  // The rename part should be atomic (especially because we guarantee it to be
  // on the same file system) so this either succeeds or doesn't happen.
  try {
    await fs.writeFile(temporaryFile, contents, 'utf8')
    await fs.rename(temporaryFile, file)
  } catch (error) {
    await fs.unlink(temporaryFile).catch(() => {})
    throw error
  }
}
