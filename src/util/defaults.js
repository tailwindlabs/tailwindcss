export function defaults(target, ...sources) {
  let copy = { ...target }
  for (let source of sources) {
    for (let k in source) {
      if (!copy?.hasOwnProperty?.(k)) {
        copy[k] = source[k]
      }
    }

    for (let k of Object.getOwnPropertySymbols(source)) {
      if (!copy?.hasOwnProperty?.(k)) {
        copy[k] = source[k]
      }
    }
  }

  return copy
}
