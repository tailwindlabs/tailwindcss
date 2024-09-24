import type { Candidate } from '../../../tailwindcss/src/candidate'
import { extractCandidates, printCandidate } from './candidates'

export type Migration = (candidate: Candidate) => Candidate | null

export default async function migrate(input: string, migrations: Migration[]): Promise<string> {
  let candidates = await extractCandidates(input)

  // Sort candidates by starting position desc
  candidates.sort((a, z) => z.start - a.start)

  let output = input
  for (let { candidate, start, end } of candidates) {
    let needsMigration = false
    for (let migration of migrations) {
      let migrated = migration(candidate)
      if (migrated) {
        candidate = migrated
        needsMigration = true
        break
      }
    }

    if (needsMigration) {
      output = output.slice(0, start) + printCandidate(candidate) + output.slice(end)
    }
  }

  return output
}
