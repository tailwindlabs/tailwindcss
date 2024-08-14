export function deepFreeze<T extends object>(obj: T): T {
  for (let name of Reflect.ownKeys(obj)) {
    let value = obj[name as keyof T]
    if (
      value !== null &&
      (typeof value === 'object' || typeof value === 'function') &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value)
    }
  }

  return Object.freeze(obj)
}
