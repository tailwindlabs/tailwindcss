type CartesianInput = readonly unknown[][]

type CartesianResult<T extends CartesianInput> = T extends [
  infer Head extends unknown[],
  ...infer Tail extends CartesianInput,
]
  ? [Head[number], ...CartesianResult<Tail>]
  : []

export function* cartesian<T extends CartesianInput>(...sets: T): Generator<CartesianResult<T>> {
  let n = sets.length
  if (n === 0) return

  // Index lookup
  let idx = Array(n).fill(0)

  while (true) {
    // Compute current combination
    let result = [] as CartesianResult<T>
    for (let i = 0; i < n; i++) {
      result[i] = sets[i][idx[i]]
    }
    yield result

    // Update index vector
    let k = n - 1
    while (k >= 0) {
      idx[k]++
      if (idx[k] < sets[k].length) {
        break
      }
      idx[k] = 0
      k--
    }

    if (k < 0) {
      return
    }
  }
}
