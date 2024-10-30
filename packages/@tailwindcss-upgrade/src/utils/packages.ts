import { exec as execCb } from 'node:child_process'
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { promisify } from 'node:util'
import { DefaultMap } from '../../../tailwindcss/src/utils/default-map'
import { warn } from './renderer'

const exec = promisify(execCb)

export function pkg(base: string) {
  return {
    async add(packages: string[], location: 'dependencies' | 'devDependencies' = 'dependencies') {
      let packageManager = await packageManagerForBase.get(base)
      return packageManager.add(packages, location)
    },
    async remove(packages: string[]) {
      let packageManager = await packageManagerForBase.get(base)
      return packageManager.remove(packages)
    },
  }
}

class PackageManager {
  constructor(private base: string) {}

  async exec(command: string) {
    return exec(command, { cwd: this.base })
  }

  async add(
    packages: string[],
    location: 'dependencies' | 'devDependencies',
  ): ReturnType<typeof this.exec> {
    throw new Error('Method not implemented.')
  }

  async remove(packages: string[]): ReturnType<typeof this.exec> {
    throw new Error('Method not implemented.')
  }
}

class BunPackageManager extends PackageManager {
  add(packages: string[], location: 'dependencies' | 'devDependencies') {
    let args = packages.slice()

    if (location === 'devDependencies') {
      args.unshift('--development')
    }

    return this.exec(`bun add ${args.join(' ')}`)
  }

  remove(packages: string[]) {
    return this.exec(`bun remove ${packages.join(' ')}`)
  }
}

class YarnPackageManager extends PackageManager {
  add(packages: string[], location: 'dependencies' | 'devDependencies') {
    let args = packages.slice()

    if (location === 'devDependencies') {
      args.unshift('--dev')
    }

    return this.exec(`yarn add ${args.join(' ')}`)
  }

  remove(packages: string[]) {
    return this.exec(`yarn remove ${packages.join(' ')}`)
  }
}

class PnpmPackageManager extends PackageManager {
  add(packages: string[], location: 'dependencies' | 'devDependencies') {
    let args = packages.slice()

    if (location === 'devDependencies') {
      args.unshift('--save-dev')
    }

    return this.exec(`pnpm add ${args.join(' ')}`)
  }

  remove(packages: string[]) {
    return this.exec(`pnpm remove ${packages.join(' ')}`)
  }
}

class NpmPackageManager extends PackageManager {
  add(packages: string[], location: 'dependencies' | 'devDependencies') {
    let args = packages.slice()

    if (location === 'devDependencies') {
      args.unshift('--save-dev')
    }

    return this.exec(`npm install ${args.join(' ')}`)
  }

  remove(packages: string[]) {
    return this.exec(`npm remove ${packages.join(' ')}`)
  }
}

let packageManagers = new DefaultMap((base) => {
  return new DefaultMap<string, PackageManager>((pm) => {
    switch (pm) {
      case 'bun':
        return new BunPackageManager(base)
      case 'yarn':
        return new YarnPackageManager(base)
      case 'pnpm':
        return new PnpmPackageManager(base)
      case 'npm':
        return new NpmPackageManager(base)
      default:
        throw new Error(`Unknown package manager: ${pm}`)
    }
  })
})

let didWarnAboutPackageManager = false
async function detectPackageManager(base: string): Promise<PackageManager> {
  do {
    // 1. Check package.json for a `packageManager` field
    let packageJsonPath = resolve(base, 'package.json')
    try {
      let packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
      let packageJson = JSON.parse(packageJsonContent)
      if (packageJson.packageManager) {
        if (packageJson.packageManager.includes('bun')) {
          return packageManagers.get(base).get('bun')
        }
        if (packageJson.packageManager.includes('yarn')) {
          return packageManagers.get(base).get('yarn')
        }
        if (packageJson.packageManager.includes('pnpm')) {
          return packageManagers.get(base).get('pnpm')
        }
        if (packageJson.packageManager.includes('npm')) {
          return packageManagers.get(base).get('npm')
        }
      }
    } catch {}

    // 2. Check for common lockfiles
    try {
      await fs.access(resolve(base, 'bun.lockb'))
      return packageManagers.get(base).get('bun')
    } catch {}
    try {
      await fs.access(resolve(base, 'bun.lock'))
      return packageManagers.get(base).get('bun')
    } catch {}
    try {
      await fs.access(resolve(base, 'pnpm-lock.yaml'))
      return packageManagers.get(base).get('pnpm')
    } catch {}

    try {
      await fs.access(resolve(base, 'yarn.lock'))
      return packageManagers.get(base).get('yarn')
    } catch {}

    try {
      await fs.access(resolve(base, 'package-lock.json'))
      return packageManagers.get(base).get('npm')
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
}
