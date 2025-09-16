import { rename, access } from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const wasmFiles = [
  'tailwindcss-oxide.debug.wasm',
  'tailwindcss-oxide.wasm',
  'tailwindcss-oxide.wasi-browser.js',
  'tailwindcss-oxide.wasi.cjs',
  'wasi-worker-browser.mjs',
  'wasi-worker.mjs',
]

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function renameTemporarily() {
  const renamed = []
  for (const file of wasmFiles) {
    const source = path.join(root, file)
    if (!(await fileExists(source))) continue
    const backup = `${source}.bak`
    await rename(source, backup)
    renamed.push({ source, backup })
  }
  return renamed
}

async function restore(renamed) {
  for (const { source, backup } of renamed) {
    await rename(backup, source)
  }
}

async function runArtifactsCli() {
  await new Promise((resolve, reject) => {
    const child = spawn(
      'pnpm',
      ['exec', 'napi', 'artifacts', '--output-dir', '.', '--npm-dir', 'npm', '--build-output-dir', 'npm/wasm32-wasi'],
      {
        cwd: root,
        stdio: 'inherit',
      },
    )

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
      } else {
        const err = new Error(
          signal ? `napi artifacts exited with signal ${signal}` : `napi artifacts exited with code ${code}`,
        )
        err.code = code
        reject(err)
      }
    })
  })
}

async function main() {
  const renamed = await renameTemporarily()
  try {
    await runArtifactsCli()
  } finally {
    await restore(renamed)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(typeof error.code === 'number' ? error.code : 1)
})
