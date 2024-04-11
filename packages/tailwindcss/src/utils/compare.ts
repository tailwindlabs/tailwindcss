const ZERO = 48
const NINE = 57

/**
 * Compare two strings alphanumerically, where numbers are compared as numbers
 * instead of strings.
 */
export function compare(a: string, z: string) {
  let aLen = a.length
  let zLen = z.length
  let minLen = aLen < zLen ? aLen : zLen

  for (let i = 0; i < minLen; i++) {
    let aCode = a.charCodeAt(i)
    let zCode = z.charCodeAt(i)

    // Continue if the characters are the same
    if (aCode === zCode) continue

    // If both are numbers, compare them as numbers instead of strings.
    if (aCode >= ZERO && aCode <= NINE && zCode >= ZERO && zCode <= NINE) {
      let initialI = i
      let aStart = i
      let zStart = i

      // Consume the number
      while (a.charCodeAt(i) >= ZERO && a.charCodeAt(i) <= NINE) i++
      let aEnd = i

      // Reset `i` to its initial value, this way we can find the end of number
      // in `z`. If we don't do this, and use `i` as is it could be that we go
      // past the number in `z`. A side effect of this is that the `Number()`
      // call will be much slower than it needs to be because it will receive
      // non-number like values.
      i = initialI

      // Consume the number
      while (z.charCodeAt(i) >= ZERO && z.charCodeAt(i) <= NINE) i++
      let zEnd = i

      let aNumber = a.slice(aStart, aEnd)
      let zNumber = z.slice(zStart, zEnd)

      if (aNumber !== zNumber) return Number(aNumber) - Number(zNumber)

      // Numbers are equal, skip to the end of the number and continue comparing
      // the rest of the string.
      i--
      continue
    }

    // Otherwise, compare them as strings
    return aCode - zCode
  }

  // If we got this far, the strings are equal up to the length of the shortest
  // string. The shortest string should come first.

  return a.length - z.length
}
