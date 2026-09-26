import { expect, it } from 'vitest'
import { serializeBatches } from './serial-batches'

it('serializes callbacks and coalesces batches received while one is running', async () => {
  let releaseFirst!: () => void
  let firstCanFinish = new Promise<void>((resolve) => (releaseFirst = resolve))
  let batches: string[][] = []
  let active = 0
  let maxActive = 0

  let batchesQueue = serializeBatches<string>(async (batch) => {
    batches.push(batch)
    active++
    maxActive = Math.max(maxActive, active)

    if (batches.length === 1) {
      await firstCanFinish
    }

    active--
  })

  let first = batchesQueue.push(['a'])
  await Promise.resolve()

  let second = batchesQueue.push(['b'])
  let third = batchesQueue.push(['c'])

  expect(batches).toEqual([['a']])
  expect(maxActive).toBe(1)

  releaseFirst()
  await Promise.all([first, second, third])

  expect(batches).toEqual([['a'], ['b', 'c']])
  expect(maxActive).toBe(1)
})

it('drains accepted batches and ignores new work after close', async () => {
  let release!: () => void
  let canFinish = new Promise<void>((resolve) => (release = resolve))
  let calls: string[][] = []
  let batchesQueue = serializeBatches<string>(async (batch) => {
    calls.push(batch)
    await canFinish
  })

  void batchesQueue.push(['accepted'])
  await Promise.resolve()
  let closing = batchesQueue.close()
  await batchesQueue.push(['late'])
  release()
  await closing

  expect(calls).toEqual([['accepted']])
})

it('holds early watcher events until the initial build is complete', async () => {
  let finishInitialBuild!: () => void
  let initialBuild = new Promise<void>((resolve) => (finishInitialBuild = resolve))
  let calls: string[][] = []
  let batchesQueue = serializeBatches<string>(async (batch) => {
    calls.push(batch)
  }, initialBuild)

  let earlyEvent = batchesQueue.push(['changed-during-initial-build'])
  await Promise.resolve()
  expect(calls).toEqual([])

  finishInitialBuild()
  await earlyEvent
  expect(calls).toEqual([['changed-during-initial-build']])
})

it('reports callback failures and continues draining accepted batches', async () => {
  let releaseFirst!: () => void
  let firstCanFail = new Promise<void>((resolve) => (releaseFirst = resolve))
  let calls: string[][] = []
  let errors: unknown[] = []
  let batchesQueue = serializeBatches<string>(
    async (batch) => {
      calls.push(batch)
      if (calls.length === 1) {
        await firstCanFail
        throw new Error('rebuild failed')
      }
    },
    Promise.resolve(),
    (error) => errors.push(error),
  )

  let first = batchesQueue.push(['first'])
  await Promise.resolve()
  let second = batchesQueue.push(['accepted-during-first'])
  releaseFirst()
  await Promise.all([first, second])

  expect(calls).toEqual([['first'], ['accepted-during-first']])
  expect(errors).toHaveLength(1)
  expect(errors[0]).toEqual(new Error('rebuild failed'))
})

it('drains work queued by a callback promise reaction', async () => {
  let finishFirst!: () => void
  let firstCallback = new Promise<void>((resolve) => (finishFirst = resolve))
  let calls: string[][] = []
  let queue = serializeBatches<string>((batch) => {
    calls.push(batch)
    return calls.length === 1 ? firstCallback : Promise.resolve()
  })

  let first = queue.push(['first'])
  let reaction = firstCallback.then(() => queue.push(['queued-by-reaction']))
  finishFirst()
  await Promise.all([first, reaction])

  expect(calls).toEqual([['first'], ['queued-by-reaction']])
})

it('deduplicates repeated items across pending batches', async () => {
  let release!: () => void
  let blocked = new Promise<void>((resolve) => (release = resolve))
  let calls: string[][] = []
  let queue = serializeBatches<string>(async (batch) => {
    calls.push(batch)
    if (calls.length === 1) await blocked
  })

  void queue.push(['first'])
  await Promise.resolve()
  void queue.push(['same', 'same'])
  void queue.push(['same'])
  release()
  await queue.close()

  expect(calls).toEqual([['first'], ['same']])
})

it('reports a rejected initial barrier once and settles', async () => {
  let errors: unknown[] = []
  let calls: string[][] = []
  let queue = serializeBatches<string>(
    async (batch) => {
      calls.push(batch)
    },
    Promise.reject(new Error('initial build failed')),
    (error) => errors.push(error),
  )

  await queue.push(['change'])
  await queue.close()

  expect(calls).toEqual([])
  expect(errors).toEqual([new Error('initial build failed')])
})

it('drains in-flight work but stays open for more', async () => {
  let release!: () => void
  let canFinish = new Promise<void>((resolve) => (release = resolve))
  let calls: string[][] = []
  let queue = serializeBatches<string>(async (batch) => {
    calls.push(batch)
    if (calls.length === 1) await canFinish
  })

  void queue.push(['first'])
  await Promise.resolve()

  let drained = queue.drain()
  release()
  await drained
  expect(calls).toEqual([['first']])

  // Draining must not close the queue — a shutdown drains before the watchers
  // have flushed what they collected, and that work still has to be accepted.
  await queue.push(['after-drain'])
  expect(calls).toEqual([['first'], ['after-drain']])
})

it('drain returns immediately when nothing is in flight', async () => {
  let calls: string[][] = []
  let queue = serializeBatches<string>(async (batch) => {
    calls.push(batch)
  })

  await queue.drain()
  expect(calls).toEqual([])
})
