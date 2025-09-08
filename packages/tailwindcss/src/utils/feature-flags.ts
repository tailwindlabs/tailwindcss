import { version as pkgVersion } from '../../package.json'
import { DefaultMap } from './default-map'

export function featureFlagVersion(...versions: string[]) {
  // Always enable feature flags during tests
  if (process.env.NODE_ENV === 'test') {
    return true
  }

  return versions.some((version) => greaterThanOrEqual(pkgVersion, version))
}

let majorMinorPatchRegex = /^(\d+)\.(\d+)\.(\d+)(?:-(\w+))?/
let parsedVersion = new DefaultMap((version: string) => {
  let result = majorMinorPatchRegex.exec(version)
  if (!result) throw new Error(`Invalid version: ${version}`)
  let [, major, minor, patch, prerelease = null] = result
  return { major: Number(major), minor: Number(minor), patch: Number(patch), prerelease }
})

export function greaterThanOrEqual(a: string, b: string) {
  let aParsed = parsedVersion.get(a)
  let bParsed = parsedVersion.get(b)

  if (aParsed.major !== bParsed.major) {
    return aParsed.major > bParsed.major
  }

  if (aParsed.minor !== bParsed.minor) {
    return aParsed.minor > bParsed.minor
  }

  if (aParsed.patch !== bParsed.patch) {
    return aParsed.patch > bParsed.patch
  }

  if (aParsed.prerelease !== bParsed.prerelease) {
    return false
  }

  return true
}
