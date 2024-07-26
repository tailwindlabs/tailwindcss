/**
 * Disposables allow you to manage resources that can be cleaned up. Each helper
 * function returns a dispose function to clean up the resource.
 *
 * The `dispose` method can be called to clean up all resources at once.
 */
export function disposables() {
  // Track all disposables
  let _disposables = new Set<Function>([])

  let api = {
    /**
     * Enqueue a callback in the macrotasks queue.
     */
    queueMacrotask(cb: () => void) {
      let timer = setTimeout(cb, 0)

      return api.add(() => {
        clearTimeout(timer)
      })
    },

    /**
     * General purpose disposable function that can be cleaned up.
     */
    add(dispose: () => void) {
      _disposables.add(dispose)

      return () => {
        _disposables.delete(dispose)

        dispose()
      }
    },

    /**
     * Dispose all disposables at once.
     */
    dispose() {
      for (let dispose of _disposables) {
        dispose()
      }

      _disposables.clear()
    },
  }

  return api
}
