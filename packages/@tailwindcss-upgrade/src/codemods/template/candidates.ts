import { Scanner } from '@tailwindcss/oxide'
import type { Candidate } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'

export async function extractRawCandidates(
  content: string,
  extension: string = 'html',
): Promise<{ rawCandidate: string; start: number; end: number }[]> {
  let scanner = new Scanner({})
  let result = scanner.getCandidatesWithPositions({ content, extension })

  let candidates: { rawCandidate: string; start: number; end: number }[] = []
  for (let { candidate: rawCandidate, position: start } of result) {
    candidates.push({ rawCandidate, start, end: start + rawCandidate.length })
  }
  return candidates
}

// Create a basic stripped candidate without variants or important flag
export function baseCandidate<T extends Candidate>(candidate: T) {
  let base = structuredClone(candidate)

  base.important = false
  base.variants = []

  return base
}

export function parseCandidate(designSystem: DesignSystem, input: string) {
  return designSystem.parseCandidate(
    designSystem.theme.prefix && !input.startsWith(`${designSystem.theme.prefix}:`)
      ? `${designSystem.theme.prefix}:${input}`
      : input,
  )
}

export function printUnprefixedCandidate(designSystem: DesignSystem, candidate: Candidate) {
  let candidateString = designSystem.printCandidate(candidate)

  return designSystem.theme.prefix && candidateString.startsWith(`${designSystem.theme.prefix}:`)
    ? candidateString.slice(designSystem.theme.prefix.length + 1)
    : candidateString
}
