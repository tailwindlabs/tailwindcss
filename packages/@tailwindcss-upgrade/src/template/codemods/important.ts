import type { Config } from 'tailwindcss'
import { parseCandidate } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { printCandidate } from '../candidates'

const QUOTES = ['"', "'", '`']
const LOGICAL_OPERATORS = ['&&', '||', '===', '==', '!=', '!==', '>', '>=', '<', '<=']
const CONDITIONAL_TEMPLATE_SYNTAX = [
  // Vue
  /v-else-if=['"]$/,
  /v-if=['"]$/,
  /v-show=['"]$/,

  // Alpine
  /x-if=['"]$/,
  /x-show=['"]$/,
]

// In v3 the important modifier `!` sits in front of the utility itself, not
// before any of the variants. In v4, we want it to be at the end of the utility
// so that it's always in the same location regardless of whether you used
// variants or not.
//
// So this:
//
//   !flex md:!block
//
// Should turn into:
//
//   flex! md:block!
export function important(
  designSystem: DesignSystem,
  _userConfig: Config,
  rawCandidate: string,
  location?: {
    contents: string
    start: number
    end: number
  },
): string {
  nextCandidate: for (let candidate of parseCandidate(rawCandidate, designSystem)) {
    if (candidate.important && candidate.raw[candidate.raw.length - 1] !== '!') {
      // The important migration is one of the most broad migrations with a high
      // potential of matching false positives since `!` is a valid character in
      // most programming languages. Since v4 is technically backward compatible
      // with v3 in that it can read `!` in the front of the utility too, we err
      // on the side of caution and only migrate candidates that we are certain
      // are inside of a string.
      if (location) {
        let currentLineBeforeCandidate = ''
        for (let i = location.start - 1; i >= 0; i--) {
          let char = location.contents.at(i)!
          if (char === '\n') {
            break
          }
          currentLineBeforeCandidate = char + currentLineBeforeCandidate
        }
        let currentLineAfterCandidate = ''
        for (let i = location.end; i < location.contents.length; i++) {
          let char = location.contents.at(i)!
          if (char === '\n') {
            break
          }
          currentLineAfterCandidate += char
        }

        // Heuristic 1: Require the candidate to be inside quotes
        let isQuoteBeforeCandidate = QUOTES.some((quote) =>
          currentLineBeforeCandidate.includes(quote),
        )
        let isQuoteAfterCandidate = QUOTES.some((quote) =>
          currentLineAfterCandidate.includes(quote),
        )
        if (!isQuoteBeforeCandidate || !isQuoteAfterCandidate) {
          continue nextCandidate
        }

        // Heuristic 2: Disallow object access immediately following the candidate
        if (currentLineAfterCandidate[0] === '.') {
          continue nextCandidate
        }

        // Heuristic 3: Disallow logical operators preceding or following the candidate
        for (let operator of LOGICAL_OPERATORS) {
          if (
            currentLineAfterCandidate.trim().startsWith(operator) ||
            currentLineBeforeCandidate.trim().endsWith(operator)
          ) {
            continue nextCandidate
          }
        }

        // Heuristic 4: Disallow conditional template syntax
        for (let rule of CONDITIONAL_TEMPLATE_SYNTAX) {
          if (rule.test(currentLineBeforeCandidate)) {
            continue nextCandidate
          }
        }
      }

      // The printCandidate function will already put the exclamation mark in
      // the right place, so we just need to mark this candidate as requiring a
      // migration.
      return printCandidate(designSystem, candidate)
    }
  }

  return rawCandidate
}
