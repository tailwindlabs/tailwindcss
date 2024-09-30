import fs from 'node:fs/promises'
import path from 'node:path'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
<<<<<<< HEAD
import { extractCandidates, printCandidate, replaceCandidateInContent } from './candidates'
import { automaticVarInjection } from './codemods/automatic-var-injection'
import { migrateImportant } from './codemods/migrate-important'
||||||| 89f0047c
import { extractCandidates, printCandidate, replaceCandidateInContent } from './candidates'
import { migrateImportant } from './codemods/migrate-important'
=======
import { extractRawCandidates, replaceCandidateInContent } from './candidates'
import { bgGradient } from './codemods/bg-gradient'
import { important } from './codemods/important'
>>>>>>> origin/next

<<<<<<< HEAD
export type Migration = (designSystem: DesignSystem, candidate: Candidate) => Candidate | null
||||||| 89f0047c
export type Migration = (candidate: Candidate) => Candidate | null
=======
export type Migration = (designSystem: DesignSystem, rawCandidate: string) => string
>>>>>>> origin/next

export default async function migrateContents(
  designSystem: DesignSystem,
  contents: string,
<<<<<<< HEAD
  migrations: Migration[] = [migrateImportant, automaticVarInjection],
||||||| 89f0047c
  migrations: Migration[] = [migrateImportant],
=======
  migrations: Migration[] = [important, bgGradient],
>>>>>>> origin/next
): Promise<string> {
  let candidates = await extractRawCandidates(contents)

  // Sort candidates by starting position desc
  candidates.sort((a, z) => z.start - a.start)

  let output = contents
  for (let { rawCandidate, start, end } of candidates) {
    let needsMigration = false
    for (let migration of migrations) {
<<<<<<< HEAD
      let migrated = migration(designSystem, candidate)
      if (migrated) {
        candidate = migrated
||||||| 89f0047c
      let migrated = migration(candidate)
      if (migrated) {
        candidate = migrated
=======
      let candidate = migration(designSystem, rawCandidate)
      if (rawCandidate !== candidate) {
        rawCandidate = candidate
>>>>>>> origin/next
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
