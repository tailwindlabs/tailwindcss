/**
 * A Map that can generate default values for keys that don't exist.
 * Generated default values are added to the map to avoid recomputation.
 */
export class DefaultMap<K, V> extends Map<K, V> {
  constructor(private factory: (key: K, self: DefaultMap<K, V>) => V) {
    super()
  }

  get(key: K): V {
    let value = super.get(key)

    if (value === undefined) {
      value = this.factory(key, this)
      this.set(key, value)
    }

    return value
  }
}
