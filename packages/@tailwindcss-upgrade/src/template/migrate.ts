import fs from 'node:fs/promises'
import path, { extname } from 'node:path'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { extractRawCandidates, replaceCandidateInContent } from './candidates'
import { automaticVarInjection } from './codemods/automatic-var-injection'
import { bgGradient } from './codemods/bg-gradient'
import { important } from './codemods/important'
import { prefix } from './codemods/prefix'
import { variantOrder } from './codemods/variant-order'

export type Migration = (
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
) => string

export const DEFAULT_MIGRATIONS: Migration[] = [
  prefix,
  important,
  automaticVarInjection,
  bgGradient,
  variantOrder,
]

export function migrateCandidate(
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
): string {
  for (let migration of DEFAULT_MIGRATIONS) {
    rawCandidate = migration(designSystem, userConfig, rawCandidate)
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

  // Sort candidates by starting position desc
  candidates.sort((a, z) => z.start - a.start)

  let output = contents
  for (let { rawCandidate, start, end } of candidates) {
    let migratedCandidate = migrateCandidate(designSystem, userConfig, rawCandidate)

    if (migratedCandidate !== rawCandidate) {
      output = replaceCandidateInContent(output, migratedCandidate, start, end)
    }
  }

  return output
}

export async function migrate(designSystem: DesignSystem, userConfig: Config, file: string) {
  let fullPath = path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(
    fullPath,
    await migrateContents(designSystem, userConfig, contents, extname(file)),
  )
}
