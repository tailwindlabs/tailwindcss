import type { DesignSystem } from './design-system'
import { DefaultMap } from './utils/default-map'

export function canonicalizeCandidates(ds: DesignSystem, candidates: string[]): string[] {
  return candidates.map((candidate) => {
    return canonicalizeCandidateCache.get(ds).get(candidate)
  })
}

const canonicalizeCandidateCache = new DefaultMap((ds: DesignSystem) => {
  return new DefaultMap((candidate: string) => {
    let result = candidate
    for (let fn of CANONICALIZATIONS) {
      let newResult = fn(ds, result)
      if (newResult !== result) {
        result = newResult
      }
    }
    return result
  })
})

const CANONICALIZATIONS = [print]

function print(designSystem: DesignSystem, rawCandidate: string): string {
  for (let candidate of designSystem.parseCandidate(rawCandidate)) {
    return designSystem.printCandidate(candidate)
  }
  return rawCandidate
}
