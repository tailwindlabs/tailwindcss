export function defaults(target, ...sources) {
  for (let source of sources) {
    for (let k in source) {
      if (!target?.hasOwnProperty?.(k)) {
        target[k] = source[k]
      }
    }
  }

  return target
}
