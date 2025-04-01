const QUOTES = ['"', "'", '`']
const LOGICAL_OPERATORS = ['&&', '||', '?', '===', '==', '!=', '!==', '>', '>=', '<', '<=']
const CONDITIONAL_TEMPLATE_SYNTAX = [
  // Vue
  /v-else-if=['"]$/,
  /v-if=['"]$/,
  /v-show=['"]$/,

  // Alpine
  /x-if=['"]$/,
  /x-show=['"]$/,
]
const NEXT_PLACEHOLDER_PROP = /placeholder=\{?['"]$/

export function isSafeMigration(location: { contents: string; start: number; end: number }) {
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

  // Heuristic: Require the candidate to be inside quotes
  let isQuoteBeforeCandidate = QUOTES.some((quote) => currentLineBeforeCandidate.includes(quote))
  let isQuoteAfterCandidate = QUOTES.some((quote) => currentLineAfterCandidate.includes(quote))
  if (!isQuoteBeforeCandidate || !isQuoteAfterCandidate) {
    return false
  }

  // Heuristic: Disallow object access immediately following the candidate
  if (currentLineAfterCandidate[0] === '.') {
    return false
  }

  // Heuristic: Disallow function call expressions immediately following the candidate
  if (currentLineAfterCandidate.trim().startsWith('(')) {
    return false
  }

  // Heuristic: Disallow logical operators preceding or following the candidate
  for (let operator of LOGICAL_OPERATORS) {
    if (
      currentLineAfterCandidate.trim().startsWith(operator) ||
      currentLineBeforeCandidate.trim().endsWith(operator)
    ) {
      return false
    }
  }

  // Heuristic: Disallow conditional template syntax
  for (let rule of CONDITIONAL_TEMPLATE_SYNTAX) {
    if (rule.test(currentLineBeforeCandidate)) {
      return false
    }
  }

  // Heuristic: Disallow Next.js Image `placeholder` prop
  if (NEXT_PLACEHOLDER_PROP.test(currentLineBeforeCandidate)) {
    return false
  }

  return true
}
