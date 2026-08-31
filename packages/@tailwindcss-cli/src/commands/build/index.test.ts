import { expect, it } from 'vitest'
import { serializeBatches } from '../../utils/serial-batches'
import { createWatchers, filterChangedFiles, shutdownWatchMode } from './index'

type WatchEvent = { type: 'create' | 'update' | 'delete'; path: string }
type WatchCallback = (error: Error | null, events: WatchEvent[]) => Promise<void>

function fakeWatcher() {
  let callbacks: WatchCallback[] = []
  return {
    callbacks,
    watcher: {
      async subscribe(_directory: string, callback: WatchCallback) {
        callbacks.push(callback)
        return { unsubscribe() {} }
      },
    },
  }
}

function nextTask() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

it('removes duplicate output and map events from a coalesced batch', () => {
  expect(
    filterChangedFiles(
      ['output.css', 'source.html', 'output.css', 'output.css.map'],
      'output.css',
      'output.css.map',
    ),
  ).toEqual(['source.html'])
})

it('flushes a collected event when shutdown cancels its debounce timer', async () => {
  let calls: string[][] = []
  let queue = serializeBatches<string>(async (files) => {
    calls.push(files)
  })
  let fake = fakeWatcher()
  let generation = await createWatchers(['/watch'], async () => {}, queue, fake.watcher)

  await fake.callbacks[0](null, [{ type: 'delete', path: 'last-change' }])
  await generation.cleanup()
  await queue.close()

  expect(calls).toEqual([['last-change']])
})

it('waits for an entered watcher callback before shutdown flushes changes', async () => {
  let releaseLstat!: () => void
  let lstatCanFinish = new Promise<void>((resolve) => (releaseLstat = resolve))
  let calls: string[][] = []
  let queue = serializeBatches<string>(async (files) => {
    calls.push(files)
  })
  let fake = fakeWatcher()
  let generation = await createWatchers(
    ['/watch'],
    async () => {},
    queue,
    fake.watcher,
    async () => {
      await lstatCanFinish
      return { isFile: () => true, isSymbolicLink: () => false }
    },
  )

  let callback = fake.callbacks[0](null, [{ type: 'update', path: 'delayed-change' }])
  let cleanup = generation.cleanup()
  await nextTask()
  expect(calls).toEqual([])

  releaseLstat()
  await Promise.all([callback, cleanup])
  await queue.close()
  expect(calls).toEqual([['delayed-change']])
})

it('writes the newest change last when an earlier rebuild is slower', async () => {
  // The reported bug: a rebuild for an older change finished *after* the rebuild
  // for a newer one and overwrote it, leaving stale CSS on disk. The serial
  // batches tests pin the scheduling on its own; this pins the outcome through
  // the watcher wiring, which is the shape the bug was reported in.
  let written: string[] = []
  let rebuildCount = 0
  let startFirstRebuild!: () => void
  let firstRebuildStarted = new Promise<void>((resolve) => (startFirstRebuild = resolve))
  let releaseSlowRebuild!: () => void
  let slowRebuildCanFinish = new Promise<void>((resolve) => (releaseSlowRebuild = resolve))

  let queue = serializeBatches<string>(async (files) => {
    // Only the *first* rebuild is slow. Counting rebuilds rather than writes
    // matters: the first rebuild is suspended below, so a write-count check
    // would also suspend the second one and the test would pass unserialized.
    if (rebuildCount++ === 0) {
      startFirstRebuild()
      await slowRebuildCanFinish
    }
    written.push(files.at(-1)!)
  })
  let fake = fakeWatcher()
  await createWatchers(
    ['/watch'],
    async () => {},
    queue,
    fake.watcher,
    async () => ({
      isFile: () => true,
      isSymbolicLink: () => false,
    }),
  )

  await fake.callbacks[0](null, [{ type: 'update', path: 'older-change' }])
  await firstRebuildStarted
  await fake.callbacks[0](null, [{ type: 'update', path: 'newer-change' }])
  await nextTask()

  releaseSlowRebuild()
  await queue.close()

  expect(written).toEqual(['older-change', 'newer-change'])
})

it('does not close the queue while a watcher swap is still flushing', async () => {
  // A rebuild swaps the watcher generation, and the old generation flushes what
  // it collected as it is torn down. If shutdown closes the queue first, those
  // files land in a closed queue and the process exits with stale CSS.
  let closed = false
  let flushed: string[] = []
  let finishSwap!: () => void
  let swap = new Promise<void>((resolve) => (finishSwap = resolve)).then(() => {
    flushed.push('collected-during-swap')
  })

  let shutdown = shutdownWatchMode(() => swap, [], {
    async close() {
      closed = true
    },
  })
  await nextTask()
  expect(closed).toBe(false)

  finishSwap()
  await shutdown

  expect(flushed).toEqual(['collected-during-swap'])
  expect(closed).toBe(true)
})

it('waits for a watcher swap that starts after shutdown begins', async () => {
  // A rebuild already in flight can swap watchers while we are shutting down.
  // Reading the swap once captures whichever was current when stdin closed, and
  // closes the queue while the later one is still flushing.
  let closed = false
  let flushed: string[] = []
  let finishFirstSwap!: () => void
  let firstSwap = new Promise<void>((resolve) => (finishFirstSwap = resolve)).then(() => {
    flushed.push('first-swap')
  })
  let finishSecondSwap!: () => void
  let secondSwap = new Promise<void>((resolve) => (finishSecondSwap = resolve)).then(() => {
    flushed.push('second-swap')
  })

  let currentSwap: Promise<unknown> = firstSwap
  let shutdown = shutdownWatchMode(() => currentSwap, [], {
    async close() {
      closed = true
    },
  })

  // The in-flight rebuild starts its own swap while shutdown is already waiting.
  currentSwap = secondSwap
  finishFirstSwap()
  await nextTask()
  expect(closed).toBe(false)

  finishSecondSwap()
  await shutdown

  expect(flushed).toEqual(['first-swap', 'second-swap'])
  expect(closed).toBe(true)
})
