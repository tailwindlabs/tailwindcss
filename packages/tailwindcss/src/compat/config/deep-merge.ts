type Customizer = (a: any, b: any) => any

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
  customizer: Customizer,
) {
  type Key = keyof T
  type Value = T[Key]
  type KnownSource = Record<Key, Value>

  for (let source of sources) {
    if (source === null || source === undefined) {
      continue
    }

    let keys = [
      //
      ...Object.getOwnPropertyNames(source),
      ...Object.getOwnPropertySymbols(source),
    ]

    for (let k of keys as Key[]) {
      let merged = customizer(target[k], source[k])

      if (merged !== undefined) {
        target[k] = merged
      } else if (!isPlainObject(target[k]) || !isPlainObject(source[k])) {
        target[k] = source[k] as any
      } else {
        target[k] = deepMerge({}, [target[k], source[k]] as any, customizer) as any
      }
    }
  }

  return target
}
