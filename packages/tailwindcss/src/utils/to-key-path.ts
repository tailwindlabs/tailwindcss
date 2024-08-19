import { segment } from './segment'

/**
 * Parse a path string into an array of path segments
 *
 * Square bracket notation `a[b]` may be used to "escape" dots that would otherwise be interpreted as path separators.
 *
 * Example:
 * a -> ['a']
 * a.b.c -> ['a', 'b', 'c']
 * a[b].c -> ['a', 'b', 'c']
 * a[b.c].e.f -> ['a', 'b.c', 'e', 'f']
 * a[b][c][d] -> ['a', 'b', 'c', 'd']
 *
 * @param {string} path
 **/
export function toKeyPath(path: string) {
  // Handle `[]` blocks as segments in addition to `.` separators.
  // This is used to extract floating point keys like `spacing[2.5]`.
  let keypath: string[] = []

  for (let part of segment(path, '.')) {
    if (!part.includes('[')) {
      keypath.push(part)
      continue
    }

    let matches = part.matchAll(/\[([^\]]+)\]/g)
    let i = 0
    for (let match of matches) {
      // Add anything between the last match and the current match
      if (match.index > i) {
        keypath.push(part.slice(i, match.index))
        i = match.index
      }

      keypath.push(match[1])
      i += match[0].length
    }
    // Add anything after the last segment
    if (i < part.length - 1) {
      keypath.push(part.slice(i))
    }
  }

  return keypath
}
