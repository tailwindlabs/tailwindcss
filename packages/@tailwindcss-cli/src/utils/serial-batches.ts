export interface SerialBatches<T> {
  push(batch: T[]): Promise<void>
  close(): Promise<void>
}

export function serializeBatches<T>(
  callback: (batch: T[]) => Promise<void>,
  startAfter: Promise<void> = Promise.resolve(),
  onError: (error: unknown) => void = console.error,
): SerialBatches<T> {
  let pending = new Set<T>()
  let inFlight: Promise<void> | null = null
  let closed = false
  let startErrorReported = false

  function report(error: unknown) {
    try {
      onError(error)
    } catch {}
  }

  function startDrain(): Promise<void> {
    inFlight = (async () => {
      try {
        await startAfter
      } catch (error) {
        if (!startErrorReported) {
          startErrorReported = true
          report(error)
        }
        pending.clear()
        return
      }
      while (pending.size > 0) {
        let next = Array.from(pending)
        pending.clear()
        try {
          await callback(next)
        } catch (error) {
          report(error)
        }
      }
    })().finally(() => {
      inFlight = null
      if (pending.size > 0) return startDrain()
    })

    return inFlight
  }

  function push(batch: T[]): Promise<void> {
    if (closed) return Promise.resolve()
    for (let item of batch) pending.add(item)

    return inFlight ?? startDrain()
  }

  return {
    push,
    async close() {
      closed = true
      await inFlight
    },
  }
}
