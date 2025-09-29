import { execSync } from 'node:child_process'
import semver from 'semver'
import { DefaultMap } from '../../../tailwindcss/src/utils/default-map'
import { getPackageVersionSync } from './package-version'

/**
 * Must be of major version.
 *
 * E.g.: `isMajor(3)`
 */
export function isMajor(version: number) {
  return semver.satisfies(installedTailwindVersion(), `>=${version}.0.0 <${version + 1}.0.0`)
}

/**
 * Must be of greater than the current major version including minor and patch.
 *
 * E.g.: `isGreaterThan(3)`
 */
export function isGreaterThan(version: number) {
  return semver.gte(installedTailwindVersion(), `${version + 1}.0.0`)
}

let cache = new DefaultMap((base) => {
  let tailwindVersion = getPackageVersionSync('tailwindcss', base)
  if (!tailwindVersion) throw new Error('Tailwind CSS is not installed')
  return tailwindVersion
})

export function installedTailwindVersion(base = process.cwd()): string {
  return cache.get(base)
}

let expectedCache = new DefaultMap((base) => {
  try {
    // This will report a problem if the package.json/package-lock.json
    // mismatches with the installed version in node_modules.
    //
    // Also tested this with Bun and PNPM, both seem to work fine.
    execSync('npm ls tailwindcss --json', { cwd: base, stdio: 'pipe' })
    return installedTailwindVersion(base)
  } catch (_e) {
    try {
      let e = _e as { stdout: Buffer }
      let data = JSON.parse(e.stdout.toString())

      return (
        // Could be a sub-dependency issue, but we are only interested in
        // the top-level version mismatch.
        /"(.*?)" from the root project/.exec(data.dependencies.tailwindcss.invalid)?.[1] ??
        // Fallback to the installed version
        installedTailwindVersion(base)
      )
    } catch {
      // We don't know how to verify, so let's just return the installed
      // version to not block the user.
      return installedTailwindVersion(base)
    }
  }
})
export function expectedTailwindVersion(base = process.cwd()): string {
  return expectedCache.get(base)
}
