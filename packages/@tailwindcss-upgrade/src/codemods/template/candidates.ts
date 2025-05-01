import { Scanner } from '@tailwindcss/oxide'

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
