import { $ } from 'bun'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function buildForPlatform(triple: string, outfile: string) {
  // We wrap this in a retry because occasionally the atomic rename fails for some reason
  for (let i = 0; i < 5; ++i) {
    try {
      let cmd = $`bun build --compile --target=${triple} ./src/index.ts --outfile=${outfile} --env inline`

      // This env var is used by our patched versions of Lightning CSS and Parcel Watcher to
      // statically bundle the proper binaries for musl vs glibc
      cmd = cmd.env({
        PLATFORM_LIBC: triple.includes('-musl') ? 'musl' : 'glibc',
      })

      return await cmd
    } catch (err) {
      if (i < 5) continue

      throw new Error(`Failed to build for platform ${triple}`, { cause: err })
    }
  }
}

async function build(triple: string, file: string) {
  let start = process.hrtime.bigint()

  let outfile = path.resolve(__dirname, `../dist/${file}`)

  await buildForPlatform(triple, outfile)

  await new Promise((resolve) => setTimeout(resolve, 100))

  let content = await readFile(outfile)
  let sum = createHash('sha256').update(content).digest('hex')

  let elapsed = process.hrtime.bigint() - start

  return {
    triple,
    file,
    sum,
    elapsed,
  }
}

await mkdir(path.resolve(__dirname, '../dist'), { recursive: true })

// Build platform binaries and checksum them. We use baseline builds for all x64 platforms to ensure
// compatibility with older hardware.
let results = await Promise.all([
  build('bun-linux-arm64', './tailwindcss-linux-arm64'),
  build('bun-linux-arm64-musl', './tailwindcss-linux-arm64-musl'),

  build('bun-linux-x64-baseline', './tailwindcss-linux-x64'),
  build('bun-linux-x64-musl-baseline', './tailwindcss-linux-x64-musl'),

  build('bun-darwin-arm64', './tailwindcss-macos-arm64'),
  build('bun-darwin-x64-baseline', './tailwindcss-macos-x64'),

  build('bun-windows-x64-baseline', './tailwindcss-windows-x64.exe'),
])

// Write the checksums to a file
let sumsFile = path.resolve(__dirname, '../dist/sha256sums.txt')
let sums = results.map(({ file, sum }) => `${sum}  ${file}`)

console.table(
  results.map(({ triple, sum, elapsed }) => ({
    triple,
    sum,
    elapsed: `${(Number(elapsed) / 1e6).toFixed(0)}ms`,
  })),
)

await writeFile(sumsFile, sums.join('\n') + '\n')
