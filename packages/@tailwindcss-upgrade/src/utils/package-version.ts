import fs from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * Resolves the version string of an npm dependency installed in the based
 * directory.
 */
export async function getPackageVersion(pkg: string, base: string): Promise<string | null> {
  try {
    console.log('getPackageVersion', pkg, base)
    const packageJson = resolve(base, 'node_modules', pkg, 'package.json')
    const { version } = JSON.parse(await fs.readFile(packageJson, 'utf8'))
    return version
  } catch {
    return null
  }
}
