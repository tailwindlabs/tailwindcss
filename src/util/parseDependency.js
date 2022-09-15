import isGlob from 'is-glob'
import globParent from 'glob-parent'
import fs from 'fs'
import path from 'path'
import { flagEnabled } from '../featureFlags'

// Based on `glob-base`
// https://github.com/micromatch/glob-base/blob/master/index.js
function parseGlob(pattern) {
  let glob = pattern
  let base = globParent(pattern)

  if (base !== '.') {
    glob = pattern.substr(base.length)
    if (glob.charAt(0) === '/') {
      glob = glob.substr(1)
    }
  }

  if (glob.substr(0, 2) === './') {
    glob = glob.substr(2)
  }
  if (glob.charAt(0) === '/') {
    glob = glob.substr(1)
  }

  return { base, glob }
}

function resolvePathSymlinks(pathDesc) {
  try {
    let newPath = fs.realpathSync(pathDesc.base, { encoding: 'utf8' })
    if (newPath !== pathDesc.base) {
      return [pathDesc, { ...pathDesc, base: newPath }]
    }
  } catch {
    // TODO: log this?
  }

  return [pathDesc]
}

function toDependency(pathDesc) {
  if (!pathDesc.glob) {
    return {
      type: 'dependency',
      file: pathDesc.base,
    }
  }

  if (process.env.ROLLUP_WATCH === 'true') {
    // rollup-plugin-postcss does not support dir-dependency messages
    // but directories can be watched in the same way as files
    return {
      type: 'dependency',
      file: pathDesc.base,
    }
  }

  return {
    type: 'dir-dependency',
    dir: pathDesc.base,
    glob: pathDesc.glob,
  }
}

export default function parseDependency(context, normalizedFileOrGlob) {
  if (normalizedFileOrGlob.startsWith('!')) {
    return []
  }

  let paths = []

  if (isGlob(normalizedFileOrGlob)) {
    let { base, glob } = parseGlob(normalizedFileOrGlob)

    paths.push({ base: base, glob })
  } else {
    paths.push({ base: normalizedFileOrGlob, glob: null })
  }

  // Resolve base paths relative to the config file or current working directory
  let resolveFrom = flagEnabled(context.tailwindConfig, 'resolveContentRelativeToConfig')
    ? [context.userConfigPath ?? process.cwd()]
    : [process.cwd()]

  paths = paths.map((pathDesc) =>
    Object.assign(pathDesc, {
      base: path.resolve(...resolveFrom, pathDesc.base),
    })
  )

  // Resolve the symlink for the base directory / file in each path
  // These are added as additional dependencies to watch for changes because
  // some tools (like webpack) will only watch the actual file or directory
  // but not the symlink itself even in projects that use monorepos.
  paths = paths.flatMap(resolvePathSymlinks)

  return paths.map(toDependency)
}
