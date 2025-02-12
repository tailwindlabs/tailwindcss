import fs from 'node:fs/promises'
import { resolveJsId } from './resolve'

/**
 * Resolves the version string of an npm dependency installed in the based
 * directory.
 */
export async function getPackageVersion(pkg: string, base: string): Promise<string | null> {
  try {
    let packageJson = resolveJsId(`${pkg}/package.json`, base)
    if (!packageJson) return null
    let { version } = JSON.parse(await fs.readFile(packageJson, 'utf8'))
    return version
  } catch {
    return null
  }
}
