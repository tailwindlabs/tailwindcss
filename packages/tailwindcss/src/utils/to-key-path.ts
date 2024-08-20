import { segment } from './segment'

/**
 * Parse a path string into an array of path segments
 *
 * Square bracket notation `a[b]` may be used to "escape" dots that would
 * otherwise be interpreted as path separators.
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
  let keypath: string[] = []

  for (let part of segment(path, '.')) {
    if (!part.includes('[')) {
      keypath.push(part)
      continue
    }

    let currentIndex = 0

    while (true) {
      let bracketL = part.indexOf('[', currentIndex)
      let bracketR = part.indexOf(']', bracketL)

      if (bracketL === -1 || bracketR === -1) {
        break
      }

      // Add the part before the bracket as a key
      if (bracketL > currentIndex) {
        keypath.push(part.slice(currentIndex, bracketL))
      }

      // Add the part inside the bracket as a key
      keypath.push(part.slice(bracketL + 1, bracketR))
      currentIndex = bracketR + 1
    }

    // Add the part after the last bracket as a key
    if (currentIndex <= part.length - 1) {
      keypath.push(part.slice(currentIndex))
    }
  }

  return keypath
}
