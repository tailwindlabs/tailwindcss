import fs from 'node:fs/promises'
import path from 'node:path'
import type { Candidate } from '../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { extractCandidates, printCandidate, replaceCandidateInContent } from './candidates'
import { migrateImportant } from './codemods/migrate-important'

export type Migration = (candidate: Candidate) => Candidate | null

export default async function migrateContents(
  designSystem: DesignSystem,
  contents: string,
  migrations: Migration[] = [migrateImportant],
): Promise<string> {
  let candidates = await extractCandidates(designSystem, contents)

  // Sort candidates by starting position desc
  candidates.sort((a, z) => z.start - a.start)

  let output = contents
  for (let { candidate, start, end } of candidates) {
    let needsMigration = false
    for (let migration of migrations) {
      let migrated = migration(candidate)
      if (migrated) {
        candidate = migrated
        needsMigration = true
      }
    }

    if (needsMigration) {
      output = replaceCandidateInContent(output, printCandidate(candidate), start, end)
    }
  }

  return output
}

export async function migrate(designSystem: DesignSystem, file: string) {
  let fullPath = path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(fullPath, await migrateContents(designSystem, contents))
}
