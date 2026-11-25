import { parseCandidate } from '../../../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import * as version from '../../utils/version'

const LOGICAL_OPERATORS = ['&&', '||', '?', '===', '==', '!=', '!==', '>', '>=', '<', '<=']
const CONDITIONAL_TEMPLATE_SYNTAX = [
  // Skip any generic attributes like `xxx="shadow"`,
  // including Vue conditions like `v-if="something && shadow"`
  // and Alpine conditions like `x-if="shadow"`,
  // but allow Vue and React classes
  /(?<!:?class|className)=['"]$/i,

  // JavaScript / TypeScript
  /addEventListener\(['"`]$/,

  // A `kind` or `type` value names a member of a union, e.g. `{ kind: 'ring' }`
  // or `effect.kind === 'ring'`
  /\b(?:kind|type)\s*(?::|[!=]==?)\s*['"`]$/,

  // A `switch` case, e.g. `case 'ring':`
  /\bcase\s+['"`]$/,

  // Alpine
  /wire:[^\s]*?$/,

  // shadcn/ui variants
  /variant\s*[:=]\s*\{?['"`]$/,
]
const NEXT_PLACEHOLDER_PROP = /placeholder=\{?['"`]$/
const VUE_3_EMIT = /\b\$?emit\(['"`]$/
const STRING_UNION_BEFORE = /(?<!\|)\|\s*['"`]$/
const STRING_UNION_AFTER = /^['"`]\s*\|(?![|>])/

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

  // Inline `style="..."` attributes can contain CSS property names that look
  // like valid utility candidates, such as `flex-grow`.
  {
    let ranges = inlineStyleAttributeValueRanges.get(location.contents)

    for (let i = 0; i < ranges.length; i += 2) {
      let start = ranges[i]
      let end = ranges[i + 1]

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

  // Heuristic: Require the candidate to be inside quotes
  let isQuoteBeforeCandidate = isMiddleOfString(currentLineBeforeCandidate)
  let isQuoteAfterCandidate = isMiddleOfString(currentLineAfterCandidate)
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

  // Heuristic: Disallow a member of a string literal union type
  //
  // E.g.: `type Shape = 'ring' | 'circle'`
  if (
    STRING_UNION_BEFORE.test(currentLineBeforeCandidate) ||
    STRING_UNION_AFTER.test(currentLineAfterCandidate)
  ) {
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

  // Heuristic: Disallow anything inside a shadcn/ui `variant` prop, because a
  // conditional can sit between the prop and the string
  //
  // E.g.: `<Button variant={active ? "outline" : "ghost"} />`
  if (isInsideVariantValue(currentLineBeforeCandidate)) {
    return false
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

// A name that only ends in `variant`, like `invariant`, is another variable, but
// `data-variant`, `props.variant` and the PHP variable `$variant` still count
const VARIANT_PROP = /(?<!\w)variant\s*(:|=(?![=>]))\s*/g
const VARIANT_COMPARISON = /\bvariant\s*[!=]==?\s*['"`]$/

// The candidate is the last thing on the line, so the `variant` value it sits in
// is the one that has not ended yet. Each form ends somewhere different:
// `variant={…}` at its matching brace, `variant="…"` at its own quote, and
// `{ variant: … }` or `const variant = …` at a separator or at the brace around
// it.
function isInsideVariantValue(line: string): boolean {
  // A string compared against `variant` is a variant name too
  //
  // E.g.: `if (variant === "outline") {}`
  if (VARIANT_COMPARISON.test(line)) return true

  for (let match of line.matchAll(VARIANT_PROP)) {
    // The prop itself is never inside a string, so a `variant:` that is only
    // mentioned in some other attribute value does not count
    if (isMiddleOfString(line.slice(0, match.index))) continue

    let start = match.index + match[0].length
    let char = line[start]

    if (match[1] === ':') {
      // A cva `variant: { … }` map holds class names, so a candidate that still
      // sits inside that object is a class, not a variant name
      if (char === '{' && isOpenValue(line, start + 1, false)) continue
      if (isOpenValue(line, start)) return true
    } else if (char === '{') {
      // A JSX value ends only at its matching brace, also when it holds an
      // assignment or a comma
      if (isOpenValue(line, start + 1, false)) return true
    } else if (char === '"' || char === "'" || char === '`') {
      if (!line.includes(char, start + 1)) return true
    } else {
      // E.g.: `const variant = active ? "outline" : "ghost"`
      if (isOpenValue(line, start)) return true
    }
  }

  return false
}

// Every string inside the value is part of it, also an argument of a call:
// `variant={getVariant(active ? "outline" : "ghost")}` computes a variant name.
//
// With `separators` off, only a closing bracket ends the value, so it tells
// whether the group that opens right before `start` is still open.
function isOpenValue(line: string, start: number, separators = true): boolean {
  let depth = 0
  let quote: string | null = null

  for (let i = start; i < line.length; i++) {
    let char = line[i]

    if (quote !== null) {
      if (char === '\\') i++
      else if (char === quote) quote = null
    } else if (char === '"' || char === "'" || char === '`') {
      quote = char
    } else if (char === '(' || char === '[' || char === '{') {
      depth++
    } else if (char === ')' || char === ']' || char === '}') {
      if (depth === 0) return false
      depth--
    } else if (separators && depth === 0 && (char === ',' || char === ';')) {
      return false
    } else if (separators && depth === 0 && char === '=' && isAssignment(line, i)) {
      // The next attribute or assignment starts, e.g. `class=` in
      // `<div data-variant=outline class="…">`
      return false
    }
  }

  return true
}

// Whether the `=` at `index` is an assignment, not a part of `==`, `!=`, `<=`,
// `>=` or `=>`
function isAssignment(line: string, index: number): boolean {
  return !'=>'.includes(line[index + 1] ?? '') && !'=!<>'.includes(line[index - 1] ?? '')
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

const BACKSLASH = 0x5c
const DOUBLE_QUOTE = 0x22
const SINGLE_QUOTE = 0x27
const BACKTICK = 0x60
const TAB = 0x09
const NEWLINE = 0x0a
const FORM_FEED = 0x0c
const CARRIAGE_RETURN = 0x0d
const SPACE = 0x20
const SLASH = 0x2f
const EQUALS = 0x3d
const GREATER_THAN = 0x3e

function isMiddleOfString(line: string): boolean {
  let currentQuote: number | null = null

  for (let i = 0; i < line.length; i++) {
    let char = line.charCodeAt(i)
    switch (char) {
      // Escaped character, skip the next character
      case BACKSLASH:
        i++
        break

      case SINGLE_QUOTE:
      case DOUBLE_QUOTE:
      case BACKTICK:
        // Found matching quote, we are outside of a string
        if (currentQuote === char) {
          currentQuote = null
        }

        // Found a quote, we are inside a string
        else if (currentQuote === null) {
          currentQuote = char
        }
        break
    }
  }

  return currentQuote !== null
}

const inlineStyleAttributeValueRanges = new DefaultMap((source: string) => {
  let ranges: number[] = []
  let offset = 0

  while (true) {
    let tagStart = source.indexOf('<', offset)
    if (tagStart === -1) return ranges

    let tagEnd = source.indexOf('>', tagStart + 1)
    if (tagEnd === -1) return ranges

    offset = tagEnd + 1

    for (let i = tagStart + 1; i < tagEnd; i++) {
      let char = source.charCodeAt(i)

      if (
        char === SPACE ||
        char === TAB ||
        char === NEWLINE ||
        char === CARRIAGE_RETURN ||
        char === FORM_FEED
      ) {
        continue
      }

      let start = i
      while (i < tagEnd) {
        let char = source.charCodeAt(i)
        if (
          char === SPACE ||
          char === TAB ||
          char === NEWLINE ||
          char === CARRIAGE_RETURN ||
          char === FORM_FEED ||
          char === EQUALS ||
          char === GREATER_THAN ||
          char === SLASH
        ) {
          break
        }

        i++
      }

      let attribute = source.slice(start, i).toLowerCase()
      if (attribute !== 'style' && attribute !== ':style') continue

      while (i < tagEnd) {
        let char = source.charCodeAt(i)
        if (
          char !== SPACE &&
          char !== TAB &&
          char !== NEWLINE &&
          char !== CARRIAGE_RETURN &&
          char !== FORM_FEED
        ) {
          break
        }

        i++
      }

      if (source[i] !== '=') continue

      i++
      while (i < tagEnd) {
        let char = source.charCodeAt(i)
        if (
          char !== SPACE &&
          char !== TAB &&
          char !== NEWLINE &&
          char !== CARRIAGE_RETURN &&
          char !== FORM_FEED
        ) {
          break
        }

        i++
      }

      let quote = source[i]
      if (quote !== '"' && quote !== "'") continue

      let valueStart = i + 1
      let valueEnd = source.indexOf(quote, valueStart)
      if (valueEnd === -1 || valueEnd > tagEnd) break

      ranges.push(valueStart, valueEnd)
      i = valueEnd
    }
  }
})
