import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { build } from 'tsup'
import { afterAll, beforeAll, expect, test } from 'vitest'
import config from '../tsup.config'

let root = path.resolve(__dirname, '..')
let outDir: string
let bundle: string
let modules: string[]

beforeAll(async () => {
  outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tailwindcss-browser-'))

  await build({
    ...config,
    config: false,
    entry: [path.join(root, 'src/index.ts')],
    tsconfig: path.join(root, 'tsconfig.json'),
    outDir,
    metafile: true,
    silent: true,
  })

  bundle = await fs.readFile(path.join(outDir, 'index.global.js'), 'utf8')

  // The source files that ended up in the bundle
  let metafile = JSON.parse(await fs.readFile(path.join(outDir, 'metafile-iife.json'), 'utf8'))
  let inputs: Record<string, { bytesInOutput: number }> = Object.values<any>(metafile.outputs)[0]
    .inputs
  modules = Object.entries(inputs)
    .filter(([, input]) => input.bytesInOutput > 0)
    .map(([file]) => file.replaceAll('\\', '/'))
})

afterAll(async () => {
  await fs.rm(outDir, { recursive: true, force: true })
})

test('includes the compiler and the stylesheets', () => {
  expect(modules).toContainEqual(expect.stringContaining('tailwindcss/src/utilities.ts'))
  expect(modules).toContainEqual(expect.stringContaining('tailwindcss/theme.css'))
  expect(modules).toContainEqual(expect.stringContaining('tailwindcss/preflight.css'))
})

// These are turned off with build-time switches in `tsup.config.ts`. When one
// of these shows up again, something started to use it outside of a switch.
test.each([
  ['IntelliSense', /\/src\/(intellisense|canonicalize-candidates)\.ts$/],
  ['the JS plugin API', /\/src\/compat\/(plugin-api|plugin-functions)\.ts$/],
  ['JS config files', /\/src\/compat\/config\//],
  ['the default JS theme', /\/src\/compat\/(default-theme|colors)\.ts$/],
])('does not include %s', (_, pattern) => {
  expect(modules.filter((file) => pattern.test(file))).toEqual([])
})

test('does not rely on `process` to exist', () => {
  // Every build-time switch must be defined in `tsup.config.ts`
  expect(bundle).not.toContain('process.env')
})

test('stays small', () => {
  // This is what users download, so growing it should be a deliberate choice.
  // If you added a feature and this fails, bump the limit.
  expect(zlib.gzipSync(bundle, { level: 9 }).byteLength).toBeLessThan(64_000)
})
