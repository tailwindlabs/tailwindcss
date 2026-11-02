import fs from 'fs'
import os from 'os'
import path from 'path'
import { createWatcher } from '../src/cli/build/watching'

let tmp
let current
let releaseGate = () => {}

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tw-watch-'))
})

afterEach(async () => {
  releaseGate()
  releaseGate = () => {}
  await current?.fswatcher.close()
  current = undefined
  fs.rmSync(tmp, { recursive: true, force: true })
})

function write(name, text) {
  let file = path.join(tmp, name)
  fs.writeFileSync(file, text)
  return file
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitFor(predicate) {
  let started = Date.now()
  while (!predicate()) {
    if (Date.now() - started > 5000) {
      throw new Error('timed out waiting for the watcher')
    }
    await delay(10)
  }
}

function watch(rebuild) {
  current = createWatcher(
    {},
    {
      state: {
        contentPatterns: {
          all: [path.join(tmp, '**/*')],
          dynamic: [path.join(tmp, '**/*')],
        },
        contextDependencies: new Set(),
        configBag: { dependencies: new Set() },
      },
      rebuild,
    }
  )

  return current
}

async function readChanges(changes) {
  let read = []
  for (let change of changes) {
    read.push({
      file: change.file,
      extension: change.extension,
      content: await change.content(),
    })
  }
  return read
}

function holdFirstRebuild() {
  let calls = []
  let markStarted
  let started = new Promise((resolve) => {
    markStarted = resolve
  })
  let gate = new Promise((resolve) => {
    releaseGate = resolve
  })

  watch(async (changes) => {
    calls.push(await readChanges(changes))
    if (calls.length === 1) {
      markStarted()
      await gate
    }
  })

  return { calls, started }
}

test('repeated change events during a rebuild still coalesce into one follow-up read', async () => {
  let { calls, started } = holdFirstRebuild()
  let page = write('page.html', 'initial')
  let view = write('view.html', 'initial')

  current.fswatcher.emit('change', page)
  await started

  for (let i = 0; i < 20; i++) {
    fs.writeFileSync(page, `page ${i}`)
    fs.writeFileSync(view, `view ${i}`)
    current.fswatcher.emit('change', page)
    current.fswatcher.emit('change', view)
  }
  releaseGate()

  await waitFor(() => calls.length >= 2)
  await delay(80)

  expect(calls).toHaveLength(2)
  expect(calls[1]).toEqual([
    { file: path.resolve(page), extension: 'html', content: 'page 19' },
    { file: path.resolve(view), extension: 'html', content: 'view 19' },
  ])
})

test('rename events during a rebuild keep each file once, with its latest text', async () => {
  let { calls, started } = holdFirstRebuild()
  let page = write('page.html', 'seed')
  let view = write('view.html', 'seed')

  current.fswatcher.emit('change', page)
  await started

  for (let i = 0; i < 8; i++) {
    fs.writeFileSync(page, `page ${i}`)
    fs.writeFileSync(view, `view ${i}`)
    current.fswatcher.emit('raw', 'rename', page, { watchedPath: page })
    current.fswatcher.emit('raw', 'rename', view, { watchedPath: view })
    await delay(30)
  }
  releaseGate()

  await waitFor(() => calls.length >= 2)
  await delay(80)

  expect(calls).toHaveLength(2)
  expect(calls[1]).toEqual([
    { file: path.resolve(page), extension: 'html', content: 'page 7' },
    { file: path.resolve(view), extension: 'html', content: 'view 7' },
  ])
})
