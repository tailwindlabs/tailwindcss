/**
 * A Map that can generate default values for keys that don't exist.
 * Generated default values are added to the map to avoid recomputation.
 */
export class DefaultMap<T = string, V = any> extends Map<T, V> {
  constructor(private factory: (key: T, self: DefaultMap<T, V>) => V) {
    super()
  }

  get(key: T): V {
    let value = super.get(key)

    if (value === undefined) {
      value = this.factory(key, this)
      this.set(key, value)
    }

    return value
  }
}
