import { exec as execCb } from 'node:child_process'
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { promisify } from 'node:util'
import { DefaultMap } from '../../../tailwindcss/src/utils/default-map'
import { error, warn } from './renderer'

const exec = promisify(execCb)

const SAVE_DEV: Record<string, string> = {
  default: '-D',
  bun: '-d',
}

export function pkg(base: string) {
  return {
    async add(packages: string[], location: 'dependencies' | 'devDependencies' = 'dependencies') {
      let packageManager = await packageManagerForBase.get(base)
      let args = packages.slice()
      if (location === 'devDependencies') {
        args.push(SAVE_DEV[packageManager] || SAVE_DEV.default)
      }

      let command = `${packageManager} add ${args.join(' ')}`
      try {
        return await exec(command, { cwd: base })
      } catch (e: any) {
        error(`An error occurred while running \`${command}\`\n\n${e.stdout}\n${e.stderr}`, {
          prefix: '↳ ',
        })
        throw e
      }
    },
    async remove(packages: string[]) {
      let packageManager = await packageManagerForBase.get(base)
      let command = `${packageManager} remove ${packages.join(' ')}`
      try {
        return await exec(command, { cwd: base })
      } catch (e: any) {
        error(`An error occurred while running \`${command}\`\n\n${e.stdout}\n${e.stderr}`, {
          prefix: '↳ ',
        })
        throw e
      }
    },
  }
}

let didWarnAboutPackageManager = false
let packageManagerForBase = new DefaultMap(async (base) => {
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
    let previousBase = base
    base = dirname(base)

    // Already at the root
    if (previousBase === base) {
      if (!didWarnAboutPackageManager) {
        didWarnAboutPackageManager = true
        warn('Could not detect a package manager. Please manually update `tailwindcss` to v4.')
      }

      return Promise.reject('No package manager detected')
    }
  } while (true)
})
