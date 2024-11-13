export function compareBreakpoints(a: string, z: string, direction: 'asc' | 'desc') {
  if (a === z) return 0

  // Assumption: when a `(` exists, we are dealing with a CSS function.
  //
  // E.g.: `calc(100% - 1rem)`
  let aIsCssFunction = a.indexOf('(')
  let zIsCssFunction = z.indexOf('(')

  let aBucket =
    aIsCssFunction === -1
      ? // No CSS function found, bucket by unit instead
        a.replace(/[\d.]+/g, '')
      : // CSS function found, bucket by function name
        a.slice(0, aIsCssFunction)

  let zBucket =
    zIsCssFunction === -1
      ? // No CSS function found, bucket by unit
        z.replace(/[\d.]+/g, '')
      : // CSS function found, bucket by function name
        z.slice(0, zIsCssFunction)

  let order =
    // Compare by bucket name
    (aBucket === zBucket ? 0 : aBucket < zBucket ? -1 : 1) ||
    // If bucket names are the same, compare by value
    (direction === 'asc' ? parseInt(a) - parseInt(z) : parseInt(z) - parseInt(a))

  // If the groups are the same, and the contents are not numbers, the
  // `order` will result in `NaN`. In this case, we want to make sorting
  // stable by falling back to a string comparison.
  //
  // This can happen when using CSS functions such as `calc`.
  //
  // E.g.:
  //
  // - `min-[calc(100%-1rem)]` and `min-[calc(100%-2rem)]`
  // - `@[calc(100%-1rem)]` and `@[calc(100%-2rem)]`
  //
  // In this scenario, we want to alphabetically sort `calc(100%-1rem)` and
  // `calc(100%-2rem)` to make it deterministic.
  if (Number.isNaN(order)) {
    return a < z ? -1 : 1
  }

  return order
}
