import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
// This file uses private APIs to work with candidates.
// TODO: Should we export this in the public package so we have the same
// version as the tailwindcss package?
import {
  parseCandidate,
  type Candidate,
  type CandidateModifier,
} from '../../../tailwindcss/src/candidate'

let css = String.raw

export async function extractCandidates(
  content: string,
): Promise<{ candidate: Candidate; start: number; end: number }[]> {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';
    `,
    { base: __dirname },
  )
  let scanner = new Scanner({})
  let result = scanner.getCandidatesWithPositions({ content, extension: 'html' })

  let candidates: { candidate: Candidate; start: number; end: number }[] = []
  for (let { candidate: rawCandidate, position: start } of result) {
    for (let candidate of parseCandidate(rawCandidate, designSystem)) {
      candidates.push({ candidate, start, end: start + rawCandidate.length })
    }
  }
  return candidates
}

export function toString(candidate: Candidate): string {
  let variants = ''
  let important = candidate.important ? '!' : ''

  switch (candidate.kind) {
    case 'arbitrary': {
      return `${variants}[${candidate.property}:${candidate.value}]${formatModifier(
        candidate.modifier,
      )}${important}`
    }
    case 'static': {
      return `${formatNegative(candidate.negative)}${variants}${candidate.root}${important}`
    }
    case 'functional': {
      let value =
        candidate.value === null
          ? ''
          : candidate.value.kind === 'named'
            ? `-${candidate.value.value}`
            : `-[${candidate.value.value}]`

      return `${formatNegative(candidate.negative)}${variants}${candidate.root}${value}${formatModifier(
        candidate.modifier,
      )}${important}`
    }
  }
}

function formatModifier(modifier: CandidateModifier | null): string {
  if (modifier === null) {
    return ''
  }
  switch (modifier.kind) {
    case 'arbitrary':
      return `/[${modifier.value}]`
    case 'named':
      return `/${modifier.value}`
  }
}

function formatNegative(negative: boolean): string {
  return negative ? '-' : ''
}
