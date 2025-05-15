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

function installedTailwindVersion(base = process.cwd()): string {
  return cache.get(base)
}
