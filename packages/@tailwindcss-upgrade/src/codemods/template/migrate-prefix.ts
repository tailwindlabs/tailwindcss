import { parseCandidate, type Candidate } from '../../../../tailwindcss/src/candidate'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { segment } from '../../../../tailwindcss/src/utils/segment'
import { printCandidate } from './candidates'

let seenDesignSystems = new WeakSet<DesignSystem>()

export function migratePrefix(
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
): string {
  if (!designSystem.theme.prefix) return rawCandidate

  if (!seenDesignSystems.has(designSystem)) {
    designSystem.utilities.functional('group', () => null)
    designSystem.utilities.functional('peer', () => null)
    seenDesignSystems.add(designSystem)
  }

  let v3Base = extractV3Base(designSystem, userConfig, rawCandidate)

  if (!v3Base) return rawCandidate

  // Only migrate candidates which are valid in v4
  let originalPrefix = designSystem.theme.prefix
  let candidate: Candidate | null = null
  try {
    designSystem.theme.prefix = null

    let unprefixedCandidate =
      rawCandidate.slice(0, v3Base.start) + v3Base.base + rawCandidate.slice(v3Base.end)

    // Note: This is not a valid candidate in the original DesignSystem, so we
    // can not use the `DesignSystem#parseCandidate` API here or otherwise this
    // invalid candidate will be cached.
    let candidates = [...parseCandidate(unprefixedCandidate, designSystem)]
    if (candidates.length > 0) {
      candidate = candidates[0]
    }
  } finally {
    designSystem.theme.prefix = originalPrefix
  }

  if (!candidate) return rawCandidate

  return printCandidate(designSystem, candidate)
}

// Parses a raw candidate with v3 compatible prefix syntax. This won't match if
// the `base` part of the candidate does not match the configured prefix, unless
// a bare candidate is used.
function extractV3Base(
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
): { base: string; start: number; end: number } | null {
  if (!designSystem.theme.prefix) return null
  if (!userConfig.prefix)
    throw new Error(
      'Could not find the Tailwind CSS v3 `prefix` configuration inside the JavaScript config.',
    )

  // hover:focus:underline
  // ^^^^^ ^^^^^^           -> Variants
  //             ^^^^^^^^^  -> Base
  let rawVariants = segment(rawCandidate, ':')

  // SAFETY: At this point it is safe to use TypeScript's non-null assertion
  // operator because even if the `input` was an empty string, splitting an
  // empty string by `:` will always result in an array with at least one
  // element.
  let base = rawVariants.pop()!
  let start = rawCandidate.length - base.length
  let end = start + base.length

  let important = false
  let negative = false

  // Candidates that end with an exclamation mark are the important version with
  // higher specificity of the non-important candidate, e.g. `mx-4!`.
  if (base[base.length - 1] === '!') {
    important = true
    base = base.slice(0, -1)
  }

  // Legacy syntax with leading `!`, e.g. `!mx-4`.
  else if (base[0] === '!') {
    important = true
    base = base.slice(1)
  }

  // Candidates that start with a dash are the negative versions of another
  // candidate, e.g. `-mx-4`.
  if (base[0] === '-') {
    negative = true
    base = base.slice(1)
  }

  if (!base.startsWith(userConfig.prefix) && base[0] !== '[') {
    return null
  } else {
    if (base[0] !== '[') base = base.slice(userConfig.prefix.length)

    if (negative) base = '-' + base
    if (important) base += '!'

    return {
      base,
      start,
      end,
    }
  }
}

const VALID_PREFIX = /([a-z]+)/
export function migratePrefixValue(prefix: string): string {
  let result = VALID_PREFIX.exec(prefix.toLocaleLowerCase())
  if (!result) {
    console.warn(
      `The prefix "${prefix} can not be used with Tailwind CSS v4 and cannot be converted to a valid one automatically. We've updated it to "tw" for you.`,
    )
    return 'tw'
  }
  return result[0]
}
