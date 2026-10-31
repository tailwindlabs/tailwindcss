import { DefaultMap } from './default-map'

/**
 * A DefaultMap that only keeps the `limit` most recently used keys.
 */
export class LRUDefaultMap<T = string, V = any> extends DefaultMap<T, V> {
  constructor(
    private limit: number,
    factory: (key: T, self: DefaultMap<T, V>) => V,
  ) {
    super(factory)
  }

  get(key: T): V {
    let value = super.get(key)

    // Mark it as the most recently used
    this.set(key, value)

    return value
  }

  set(key: T, value: V): this {
    // Move it to the end, so that it is evicted last
    this.delete(key)
    super.set(key, value)

    if (this.size > this.limit) {
      this.delete(this.keys().next().value!)
    }

    return this
  }
}
