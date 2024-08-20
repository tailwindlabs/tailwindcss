export function isPlainObject<T>(value: T): value is T & Record<keyof T, unknown> {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || Object.getPrototypeOf(prototype) === null
}

export function deepMerge<T extends object>(
  target: T,
  sources: (Partial<T> | null | undefined)[],
  customizer: (a: any, b: any) => any,
) {
  type Key = keyof T
  type Value = T[Key]

  for (let source of sources) {
    if (source === null || source === undefined) {
      continue
    }

    for (let k of Reflect.ownKeys(source) as Key[]) {
      let merged = customizer(target[k], source[k])

      if (merged !== undefined) {
        target[k] = merged
      } else if (!isPlainObject(target[k]) || !isPlainObject(source[k])) {
        target[k] = source[k] as Value
      } else {
        target[k] = deepMerge({}, [target[k], source[k]], customizer) as Value
      }
    }
  }

  return target
}
