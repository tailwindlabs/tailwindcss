import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Workaround for Bun binary downloads failing on Windows CI when
// USERPROFILE is passed through by Turborepo.
//
// Unfortunately, setting this at runtime doesn't appear to work so we have to
// spawn a new process without the env var.
if (process.env.NESTED_BUILD !== '1' && process.env.USERPROFILE && process.env.USERPROFILE !== '') {
  let result = await Bun.$`bun ${fileURLToPath(import.meta.url)}`.env({
    USERPROFILE: '',
    NESTED_BUILD: '1',
  })

  process.exit(result.exitCode)
}

// We use baseline builds for all x64 platforms to ensure compatibility with
// older hardware.
let builds: { target: Bun.Build.Target; name: string }[] = [
  { name: 'tailwindcss-linux-arm64', target: 'bun-linux-arm64' },
  { name: 'tailwindcss-linux-arm64-musl', target: 'bun-linux-arm64-musl' },
  // @ts-expect-error: Either the types are wrong or the runtime needs to be updated
  // to accept a `-glibc` at the end like the types suggest.
  { name: 'tailwindcss-linux-x64', target: 'bun-linux-x64-baseline' },
  { name: 'tailwindcss-linux-x64-musl', target: 'bun-linux-x64-baseline-musl' },
  { name: 'tailwindcss-macos-arm64', target: 'bun-darwin-arm64' },
  { name: 'tailwindcss-macos-x64', target: 'bun-darwin-x64-baseline' },
  { name: 'tailwindcss-windows-x64.exe', target: 'bun-windows-x64-baseline' },
]

let summary: { target: Bun.Build.Target; name: string; sum: string }[] = []

// Build platform binaries and checksum them.
let start = process.hrtime.bigint()
for (let { target, name } of builds) {
  let outfile = path.resolve(__dirname, `../dist/${name}`)

  let result = await Bun.build({
    entrypoints: ['./src/index.ts'],
    target: 'node',

    define: {
      // This ensures only necessary binaries are bundled for linux targets
      // It reduces binary size since no runtime selection is necessary
      'process.env.PLATFORM_LIBC': JSON.stringify(target.includes('-musl') ? 'musl' : 'glibc'),
    },

    compile: {
      target,
      outfile,

      // Disable .env loading
      autoloadDotenv: false,

      // Disable bunfig.toml loading
      autoloadBunfig: false,
    },
  })

  let entry = result.outputs.find((output) => output.kind === 'entry-point')
  if (!entry) throw new Error(`Build failed for ${target}`)

  let content = await readFile(outfile)

  summary.push({
    target,
    name,
    sum: createHash('sha256').update(content).digest('hex'),
  })
}

await mkdir(path.resolve(__dirname, '../dist'), { recursive: true })

// Write the checksums to a file
let sumsFile = path.resolve(__dirname, '../dist/sha256sums.txt')
let sums = summary.map(({ name, sum }) => `${sum}  ./${name}`)

await writeFile(sumsFile, sums.join('\n') + '\n')

console.table(summary.map(({ target, sum }) => ({ target, sum })))

let elapsed = process.hrtime.bigint() - start
console.log(`Build completed in ${(Number(elapsed) / 1e6).toFixed(0)}ms`)
