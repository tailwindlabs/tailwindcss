export {}

declare global {
  interface Map<K, V> {
    getOrInsert(key: K, defaultValue: V): V
  }
}

if (typeof Map.prototype.getOrInsert !== 'function') {
  Object.defineProperty(Map.prototype, 'getOrInsert', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function <K, V>(this: Map<K, V>, key: K, defaultValue: V): V {
      if (!this.has(key)) {
        this.set(key, defaultValue)
      }

      return this.get(key)!
    },
  })
}
