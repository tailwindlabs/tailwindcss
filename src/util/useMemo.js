import { shared } from './disposables'

export function useMemo(cb, keyResolver) {
  let cache = new Map()

  function clearCache() {
    cache.clear()
    shared.add(clearCache)
  }

  shared.add(clearCache)

  return (...args) => {
    let key = keyResolver(...args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    let result = cb(...args)
    cache.set(key, result)

    return result
  }
}
