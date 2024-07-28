import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import * as path from 'node:path'

const files = [
  './tailwindcss-linux-arm64',
  './tailwindcss-linux-armv7',
  './tailwindcss-linux-x64',
  './tailwindcss-macos-arm64',
  './tailwindcss-macos-x64',
  './tailwindcss-windows-arm64.exe',
  './tailwindcss-windows-x64.exe',
]

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const lines = await Promise.all(
  files.map(async (file) => {
    let sum = createHash('sha256')
      .update(await readFile(path.resolve(__dirname, '../dist', file)))
      .digest('hex')

    return `${sum}  ${file}`
  })
)

await writeFile(path.resolve(__dirname, '../dist', 'sha256sums.txt'), lines.join('\n') + '\n')
