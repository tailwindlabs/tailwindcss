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

it('waits for an in-flight rebuild before tearing down the watchers', async () => {
  // A full rebuild runs inside the queue and swaps the watcher generation while
  // it does. Tearing the watchers down first races that swap.
  let order: string[] = []
  let finishRebuild!: () => void
  let rebuildDone = new Promise<void>((resolve) => (finishRebuild = resolve))
  let queue = serializeBatches<string>(async () => {
    order.push('rebuild:start')
    await rebuildDone
    order.push('rebuild:end')
  })

  void queue.push(['change'])
  await nextTask()

  let shutdown = shutdownWatchMode(
    [
      async () => {
        order.push('cleanup')
      },
    ],
    queue,
  )
  await nextTask()
  expect(order).toEqual(['rebuild:start'])

  finishRebuild()
  await shutdown

  expect(order).toEqual(['rebuild:start', 'rebuild:end', 'cleanup'])
})

it('processes what the watchers flush on the way out', async () => {
  // The watchers flush what they collected as they are torn down. That has to
  // land in a queue that is still open, or it is dropped and we exit as if all
  // was well.
  let processed: string[][] = []
  let queue = serializeBatches<string>(async (files) => {
    processed.push(files)
  })

  await shutdownWatchMode(
    [
      async () => {
        void queue.push(['flushed-on-shutdown'])
      },
    ],
    queue,
  )

  expect(processed).toEqual([['flushed-on-shutdown']])
})
