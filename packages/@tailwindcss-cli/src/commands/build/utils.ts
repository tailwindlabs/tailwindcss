import fs from 'node:fs/promises'
import path from 'node:path'

export function drainStdin() {
  return new Promise<string>((resolve, reject) => {
    let result = ''
    process.stdin.on('data', (chunk) => {
      result += chunk
    })
    process.stdin.on('end', () => resolve(result))
    process.stdin.on('error', (err) => reject(err))
  })
}

export async function outputFile(file: string, contents: string) {
  // Check for special files like `/dev/stdout` or pipes. We don't want to read from these as that
  // will hang the process until the file descriptors are closed.
  let isSpecialFile = await fs
    .stat(file)
    .then((stats) => stats.isCharacterDevice() || stats.isFIFO())
    .catch(() => true)

  if (!isSpecialFile) {
    try {
      let currentContents = await fs.readFile(file, 'utf8')
      if (currentContents === contents) return // Skip writing the file
    } catch {}
  }

  // Ensure the parent directories exist
  await fs.mkdir(path.dirname(file), { recursive: true })

  // Write the file
  await fs.writeFile(file, contents, 'utf8')
}
