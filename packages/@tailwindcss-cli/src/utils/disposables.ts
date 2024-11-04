/**
 * Disposables allow you to manage resources that can be cleaned up. Each helper
 * function returns a dispose function to clean up the resource.
 *
 * The `dispose` method can be called to clean up all resources at once.
 */
export class Disposables {
  // Track all disposables
  #disposables = new Set<Function>([])

  /**
   * Enqueue a callback in the macrotasks queue.
   */
  queueMacrotask(cb: () => void) {
    let timer = setTimeout(cb, 0)

    return this.add(() => {
      clearTimeout(timer)
    })
  }

  /**
   * General purpose disposable function that can be cleaned up.
   */
  add(dispose: () => void) {
    this.#disposables.add(dispose)

    return () => {
      this.#disposables.delete(dispose)

      dispose()
    }
  }

  /**
   * Dispose all disposables at once.
   */
  async dispose() {
    for (let dispose of this.#disposables) {
      await dispose()
    }

    this.#disposables.clear()
  }
}
