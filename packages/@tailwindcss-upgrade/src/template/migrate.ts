import fs from 'node:fs/promises'
import path from 'node:path'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { extractRawCandidates, replaceCandidateInContent } from './candidates'
import { automaticVarInjection } from './codemods/automatic-var-injection'
import { bgGradient } from './codemods/bg-gradient'
import { important } from './codemods/important'

export type Migration = (designSystem: DesignSystem, rawCandidate: string) => string

export default async function migrateContents(
  designSystem: DesignSystem,
  contents: string,
  migrations: Migration[] = [important, automaticVarInjection, bgGradient],
): Promise<string> {
  let candidates = await extractRawCandidates(contents)

  // Sort candidates by starting position desc
  candidates.sort((a, z) => z.start - a.start)

  let output = contents
  for (let { rawCandidate, start, end } of candidates) {
    let needsMigration = false
    for (let migration of migrations) {
      let candidate = migration(designSystem, rawCandidate)
      if (rawCandidate !== candidate) {
        rawCandidate = candidate
        needsMigration = true
      }
    }

    if (needsMigration) {
      output = replaceCandidateInContent(output, rawCandidate, start, end)
    }
  }

  return output
}

export async function migrate(designSystem: DesignSystem, file: string) {
  let fullPath = path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(fullPath, await migrateContents(designSystem, contents))
}
