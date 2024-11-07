import { normalizePath } from '@tailwindcss/node'
import braces from 'braces'
import path from 'node:path'

interface GlobEntry {
  base: string
  pattern: string
}

export function hoistStaticGlobParts(entry: GlobEntry): GlobEntry[] {
  return braces(entry.pattern, { expand: true }).map((pattern) => {
    let clone = { ...entry }
    let [staticPart, dynamicPart] = splitPattern(pattern)

    // Move static part into the `base`.
    let absolutePosixPath = normalizePath(entry.base)

    if (staticPart !== null) {
      clone.base = path.posix.join(absolutePosixPath, staticPart)
    } else {
      clone.base = absolutePosixPath
    }

    // Move dynamic part into the `pattern`.
    if (dynamicPart === null) {
      clone.pattern = '**/*'
    } else {
      clone.pattern = dynamicPart
    }

    // If the pattern looks like a file, move the file name from the `base` to
    // the `pattern`.
    let file = path.basename(clone.base)
    if (file.includes('.')) {
      clone.pattern = file
      clone.base = path.dirname(clone.base)
    }

    return clone
  })
}

// Split a glob pattern into a `static` and `dynamic` part.
//
// Assumption: we assume that all globs are expanded, which means that the only
// dynamic parts are using `*`.
//
// E.g.:
//  Original input: `../project-b/**/*.{html,js}`
//  Expanded input: `../project-b/**/*.html` & `../project-b/**/*.js`
//  Split on first input: ("../project-b", "**/*.html")
//  Split on second input: ("../project-b", "**/*.js")
function splitPattern(pattern: string): [staticPart: string | null, dynamicPart: string | null] {
  // No dynamic parts, so we can just return the input as-is.
  if (!pattern.includes('*')) {
    return [pattern, null]
  }

  let lastSlashPosition: number | null = null

  for (let i = 0; i < pattern.length; i++) {
    let c = pattern[i]
    if (c === '/') {
      lastSlashPosition = i
    }

    if (c === '*' || c === '!') {
      break
    }
  }

  // Very first character is a `*`, therefore there is no static part, only a
  // dynamic part.
  if (lastSlashPosition === null) {
    return [null, pattern]
  }

  let staticPart = pattern.slice(0, lastSlashPosition).trim()
  let dynamicPart = pattern.slice(lastSlashPosition + 1).trim()

  return [staticPart || null, dynamicPart || null]
}
