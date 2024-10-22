import fs from 'node:fs/promises'
import path, { extname } from 'node:path'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { extractRawCandidates } from './candidates'
import { arbitraryValueToBareValue } from './codemods/arbitrary-value-to-bare-value'
import { automaticVarInjection } from './codemods/automatic-var-injection'
import { bgGradient } from './codemods/bg-gradient'
import { important } from './codemods/important'
import { maxWidthScreen } from './codemods/max-width-screen'
import { prefix } from './codemods/prefix'
import { simpleLegacyClasses } from './codemods/simple-legacy-classes'
import { themeToVar } from './codemods/theme-to-var'
import { variantOrder } from './codemods/variant-order'
import { spliceChangesIntoString, type StringChange } from './splice-changes-into-string'

export type Migration = (
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
  location?: {
    contents: string
    start: number
    end: number
  },
) => string

export const DEFAULT_MIGRATIONS: Migration[] = [
  prefix,
  important,
  automaticVarInjection,
  bgGradient,
  simpleLegacyClasses,
  arbitraryValueToBareValue,
  maxWidthScreen,
  themeToVar,
  variantOrder,
]

export function migrateCandidate(
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
  // Location is only set when migrating a candidate from a source file
  location?: {
    contents: string
    start: number
    end: number
  },
): string {
  for (let migration of DEFAULT_MIGRATIONS) {
    rawCandidate = migration(designSystem, userConfig, rawCandidate, location)
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
    let migratedCandidate = migrateCandidate(designSystem, userConfig, rawCandidate, {
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
  let fullPath = path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(
    fullPath,
    await migrateContents(designSystem, userConfig, contents, extname(file)),
  )
}
