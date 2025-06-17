import { parseCandidate } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import * as version from '../../utils/version'

const QUOTES = ['"', "'", '`']
const LOGICAL_OPERATORS = ['&&', '||', '?', '===', '==', '!=', '!==', '>', '>=', '<', '<=']
const CONDITIONAL_TEMPLATE_SYNTAX = [
  // Vue
  /v-else-if=['"]$/,
  /v-if=['"]$/,
  /v-show=['"]$/,
  /(?<!:?class)=['"]$/,

  // Alpine
  /x-if=['"]$/,
  /x-show=['"]$/,
  /wire:[^\s]*?$/,
]
const NEXT_PLACEHOLDER_PROP = /placeholder=\{?['"]$/
const VUE_3_EMIT = /\b\$?emit\(['"]$/

export function isSafeMigration(
  rawCandidate: string,
  location: { contents: string; start: number; end: number },
  designSystem: DesignSystem,
): boolean {
  // Ensure we are not migrating a candidate in a `<style>` block. The heuristic
  // would be if the candidate is preceded by a whitespace and followed by a
  // colon and whitespace.
  //
  // E.g.:
  // ```vue
  // <template>
  //   <div class="foo"></div>
  // </template>
  //
  //
  // <style>
  // .foo {
  //   flex-shrink: 0;
  //  ^           ^^
  // }
  // </style>
  // ```
  if (
    // Whitespace before the candidate
    location.contents[location.start - 1]?.match(/\s/) &&
    // A colon followed by whitespace after the candidate
    location.contents.slice(location.end, location.end + 2)?.match(/^:\s/)
  ) {
    // Compute all `<style>` ranges once and cache it for the current files
    let ranges = styleBlockRanges.get(location.contents)

    for (let i = 0; i < ranges.length; i += 2) {
      let start = ranges[i]
      let end = ranges[i + 1]

      // Check if the candidate is inside a `<style>` block
      if (location.start >= start && location.end <= end) {
        return false
      }
    }
  }

  let [candidate] = parseCandidate(rawCandidate, designSystem)

  // If we can't parse the candidate, then it's not a candidate at all. However,
  // we could be dealing with legacy classes like `tw__flex` in Tailwind CSS v3
  // land, which also wouldn't parse.
  //
  // So let's only skip if we couldn't parse and we are not in Tailwind CSS v3.
  //
  if (!candidate && version.isGreaterThan(3)) {
    return false
  }

  // Parsed a candidate successfully, verify if it's a valid candidate
  else if (candidate) {
    // When we have variants, we can assume that the candidate is safe to migrate
    // because that requires colons.
    //
    // E.g.: `hover:focus:flex`
    if (candidate.variants.length > 0) {
      return true
    }

    // When we have an arbitrary property, the candidate has such a particular
    // structure it's very likely to be safe.
    //
    // E.g.: `[color:red]`
    if (candidate.kind === 'arbitrary') {
      return true
    }

    // A static candidate is very likely safe if it contains a dash.
    //
    // E.g.: `items-center`
    if (candidate.kind === 'static' && candidate.root.includes('-')) {
      return true
    }

    // A functional candidate is very likely safe if it contains a value (which
    // implies a `-`). Or if the root contains a dash.
    //
    // E.g.: `bg-red-500`, `bg-position-20`
    if (
      (candidate.kind === 'functional' && candidate.value !== null) ||
      (candidate.kind === 'functional' && candidate.root.includes('-'))
    ) {
      return true
    }

    // If the candidate contains a modifier, it's very likely to be safe because
    // it implies that it contains a `/`.
    //
    // E.g.: `text-sm/7`
    if (candidate.kind === 'functional' && candidate.modifier) {
      return true
    }
  }

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

  // Heuristic: Disallow replacements inside `emit('…', …)`
  if (VUE_3_EMIT.test(currentLineBeforeCandidate)) {
    return false
  }

  return true
}

// Assumptions:
// - All `<style` tags appear before the next `</style>` tag
// - All `<style` tags are closed with `</style>`
// - No nested `<style>` tags
const styleBlockRanges = new DefaultMap((source: string) => {
  let ranges: number[] = []
  let offset = 0

  while (true) {
    let startTag = source.indexOf('<style', offset)
    if (startTag === -1) return ranges

    offset = startTag + 1

    // Ensure the style looks like:
    // - `<style>`   (closed)
    // - `<style …>` (with attributes)
    if (!source[startTag + 6].match(/[>\s]/)) continue

    let endTag = source.indexOf('</style>', offset)
    if (endTag === -1) return ranges
    offset = endTag + 1

    ranges.push(startTag, endTag)
  }
})
