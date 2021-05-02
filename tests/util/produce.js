// Full credit goes to: https://github.com/purplestone/exhaust
// However, it is modified so that it is a bit more modern
export function produce(blueprint) {
  let groups = []

  // Call the blueprint once so that we can collect all the possible values we
  // spit out in the callback function.
  blueprint((...args) => {
    if (args.length <= 0) throw new Error('Blueprint callback must have at least a single value')
    groups.push(args)
  })

  // Calculate how many combinations there are
  let iterations = groups.reduce((total, current) => total * current.length, 1)

  // Calculate all the combinations possible
  let zippedGroups = []
  let currentIteration = iterations
  groups.forEach((a) => {
    let n = a.length
    currentIteration = currentIteration / n
    let iS = -1
    let aS = []

    for (let i = 0; i < iterations; i++) {
      if (!(i % currentIteration)) iS++
      aS.push(a[iS % n])
    }
    zippedGroups.push(aS)
  })

  // Transpose the matrix, so that we can get the correct rows/columns structure
  // again.
  zippedGroups = zippedGroups[0].map((_, i) => zippedGroups.map((o) => o[i]))

  // Call the blueprint again, but now give the inner function a single value
  // every time so that we can build up the final result with single values.
  return zippedGroups.map((group) => {
    let i = 0
    return blueprint(() => group[i++])
  })
}
