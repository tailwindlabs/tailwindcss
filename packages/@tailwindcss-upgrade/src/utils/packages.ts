import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { warn } from './renderer'

let didWarnAboutPackageManager = false

export async function pkg(command: string, base: string): Promise<Buffer | void> {
  let packageManager = await detectPackageManager(base)
  if (!packageManager) {
    if (!didWarnAboutPackageManager) {
      didWarnAboutPackageManager = true
      warn('Could not detect a package manager. Please manually update `tailwindcss` to v4.')
    }
    return
  }
  return execSync(`${packageManager} ${command}`, {
    cwd: base,
  })
}

async function detectPackageManager(base: string): Promise<null | string> {
  do {
    // 1. Check package.json for a `packageManager` field
    let packageJsonPath = resolve(base, 'package.json')
    try {
      let packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
      let packageJson = JSON.parse(packageJsonContent)
      if (packageJson.packageManager) {
        if (packageJson.packageManager.includes('bun')) {
          return 'bun'
        }
        if (packageJson.packageManager.includes('yarn')) {
          return 'yarn'
        }
        if (packageJson.packageManager.includes('pnpm')) {
          return 'pnpm'
        }
        if (packageJson.packageManager.includes('npm')) {
          return 'npm'
        }
      }
    } catch {}

    // 2. Check for common lockfiles
    try {
      await fs.access(resolve(base, 'bun.lockb'))
      return 'bun'
    } catch {}
    try {
      await fs.access(resolve(base, 'bun.lock'))
      return 'bun'
    } catch {}
    try {
      await fs.access(resolve(base, 'pnpm-lock.yaml'))
      return 'pnpm'
    } catch {}

    try {
      await fs.access(resolve(base, 'yarn.lock'))
      return 'yarn'
    } catch {}

    try {
      await fs.access(resolve(base, 'package-lock.json'))
      return 'npm'
    } catch {}

    // 3. If no lockfile is found, we might be in a monorepo
    base = dirname(base)
  } while (true)
}
