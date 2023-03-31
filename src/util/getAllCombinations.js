export function getAllCombinations(arr) {
  const result = []

  function permutations(input, prefix = []) {
    if (input.length === 0) {
      result.push(prefix)
    } else {
      for (let i = 0; i < input.length; i++) {
        const newInput = input.slice(0, i).concat(input.slice(i + 1))
        const newPrefix = prefix.concat(input[i])
        permutations(newInput, newPrefix)
      }
    }
  }

  function loop(start, depth, prefix) {
    for (let i = start; i < arr.length; i++) {
      const next = prefix.concat(arr[i])
      if (depth > 0) {
        loop(i + 1, depth - 1, next)
      } else {
        permutations(next)
      }
    }
  }

  for (let i = 0; i < arr.length; i++) {
    loop(0, i, [])
  }

  return result
}
