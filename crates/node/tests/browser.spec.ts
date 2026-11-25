import { expect, test } from '@playwright/test'
import { once } from 'node:events'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { build } from 'tsup'

let server: Server
let output: string
let origin: string

test.beforeAll(async () => {
  output = await mkdtemp(path.join(tmpdir(), 'oxide-browser-'))
  await build({
    entry: { browser: path.join(__dirname, 'fixtures/browser.mjs') },
    outDir: output,
    format: ['esm'],
    platform: 'browser',
    target: 'esnext',
    noExternal: [/.*/],
    config: false,
    silent: true,
  })

  let script = await readFile(path.join(output, 'browser.mjs'))
  let wasm = await readFile(
    path.join(__dirname, '../npm/wasm32-wasi/tailwindcss-oxide.browser.wasm'),
  )
  // Deliberately serve without COOP/COEP: this is the deployment we need to support.
  server = createServer((req, res) => {
    if (req.url === '/browser.mjs') {
      res.setHeader('Content-Type', 'text/javascript')
      res.end(script)
    } else if (req.url === '/tailwindcss-oxide.browser.wasm') {
      res.setHeader('Content-Type', 'application/wasm')
      res.end(wasm)
    } else if (req.url === '/worker.mjs') {
      res.setHeader('Content-Type', 'text/javascript')
      res.end(`
        import { Scanner } from './browser.mjs'
        let scanner = new Scanner({ sources: [] })
        postMessage({
          sharedArrayBuffer: typeof SharedArrayBuffer,
          candidates: scanner.scanFiles([{ content: 'flex grid', extension: 'html' }]),
        })
      `)
    } else {
      res.setHeader('Content-Type', 'text/html')
      res.end('<!doctype html><title>Oxide browser test</title>')
    }
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  let address = server.address()
  if (!address || typeof address === 'string') throw new Error('Missing server address')
  origin = `http://127.0.0.1:${address.port}`
})

test.afterAll(async () => {
  if (server) await new Promise<void>((resolve) => server.close(() => resolve()))
  if (output) await rm(output, { recursive: true, force: true })
})

test.beforeEach(async ({ page }) => {
  await page.goto(origin)
  expect(await page.evaluate(() => crossOriginIsolated)).toBe(false)
  expect(await page.evaluate(() => typeof SharedArrayBuffer)).toBe('undefined')
})

test('extracts candidates and UTF-16 positions without shared memory or workers', async ({
  page,
}) => {
  await page.addInitScript(() => {
    globalThis.Worker = class {
      constructor() {
        throw new Error('The single-threaded browser build must not create workers')
      }
    } as unknown as typeof Worker
  })
  await page.reload()

  let result = await page.evaluate(async () => {
    let { Scanner } = await import('/browser.mjs')
    let scanner = new Scanner({ sources: [] })
    return {
      candidates: scanner.scanFiles([
        { content: '<div class="flex underline">', extension: 'html' },
      ]),
      incremental: scanner.scanFiles([{ content: '<div class="flex grid">', extension: 'html' }]),
      positions: scanner.getCandidatesWithPositions({ content: '😀 flex', extension: 'html' }),
    }
  })
  expect(result).toEqual({
    candidates: ['class', 'flex', 'underline'],
    incremental: ['grid'],
    positions: [{ candidate: 'flex', position: 3 }],
  })
})

test('discovers memfs files and tracks incremental changes', async ({ page }) => {
  let result = await page.evaluate(async () => {
    let { Scanner, __fs, __volume } = await import('/browser.mjs')
    __volume.fromJSON({ '/src/index.html': '<div class="flex">' })
    let scanner = new Scanner({
      sources: [{ base: '/src', pattern: '**/*', negated: false }],
    })
    function scan() {
      return {
        candidates: scanner.scan(),
        files: scanner.files.sort(),
        scannedFiles: scanner.scannedFiles.sort(),
      }
    }
    let initial = scan()
    let unchanged = scan()
    __fs.writeFileSync('/src/index.html', '<div class="grid">')
    __fs.utimesSync('/src/index.html', new Date(), new Date(Date.now() + 2000))
    let changed = scan()
    __fs.mkdirSync('/src/nested')
    __fs.writeFileSync('/src/nested/index.html', '<div class="underline">')
    let added = scan()
    return {
      initial,
      unchanged,
      changed,
      added,
      sources: scanner.normalizedSources,
      globs: scanner.globs,
    }
  })

  expect(result).toEqual({
    initial: {
      candidates: ['class', 'flex'],
      files: ['/src/index.html'],
      scannedFiles: ['/src/index.html'],
    },
    unchanged: { candidates: ['class', 'flex'], files: ['/src/index.html'], scannedFiles: [] },
    changed: {
      candidates: ['class', 'flex', 'grid'],
      files: ['/src/index.html'],
      scannedFiles: ['/src/index.html'],
    },
    added: {
      candidates: ['class', 'flex', 'grid', 'underline'],
      files: ['/src/index.html', '/src/nested/index.html'],
      scannedFiles: ['/src/nested/index.html'],
    },
    sources: [{ base: '/src', pattern: '**/*' }],
    globs: [
      { base: '/src', pattern: '*' },
      { base: '/src/nested', pattern: expect.stringContaining('html') },
    ],
  })
})

test('can run in an application-owned worker without isolation', async ({ page }) => {
  let result = await page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        let worker = new Worker('/worker.mjs', { type: 'module' })
        worker.onmessage = ({ data }) => {
          worker.terminate()
          resolve(data)
        }
        worker.onerror = (event) => {
          worker.terminate()
          reject(new Error(event.message))
        }
      }),
  )
  expect(result).toEqual({ sharedArrayBuffer: 'undefined', candidates: ['flex', 'grid'] })
})
