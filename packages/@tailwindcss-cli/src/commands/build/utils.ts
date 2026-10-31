import type { ChangedContent } from '@tailwindcss/oxide'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathsEqual } from '../../utils/paths-equal'

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
    .catch(() => false)

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

export function getRebuildStrategy(
  files: string[],
  fullRebuildPaths: string[],
  platform: NodeJS.Platform = process.platform,
): { kind: 'incremental'; changedFiles: ChangedContent[] } | { kind: 'full' } {
  let changedFiles: ChangedContent[] = []

  for (let file of files) {
    // If one of the changed files is related to the input CSS or JS
    // config/plugin files, then we need to do a full rebuild because
    // the theme might have changed.
    if (fullRebuildPaths.some((p) => pathsEqual(p, file, platform))) {
      return { kind: 'full' }
    }

    // Track new and updated files for incremental rebuilds.
    changedFiles.push({
      file,
      extension: path.extname(file).slice(1),
    } satisfies ChangedContent)
  }

  return { kind: 'incremental', changedFiles }
}
