import isGlob from 'is-glob'
import globParent from 'glob-parent'
import path from 'path'

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

export default function parseDependency(normalizedFileOrGlob) {
  if (normalizedFileOrGlob.startsWith('!')) {
    return null
  }

  let message

  if (isGlob(normalizedFileOrGlob)) {
    let { base, glob } = parseGlob(normalizedFileOrGlob)
    message = { type: 'dir-dependency', dir: path.resolve(base), glob }
  } else {
    message = { type: 'dependency', file: path.resolve(normalizedFileOrGlob) }
  }

  // rollup-plugin-postcss does not support dir-dependency messages
  // but directories can be watched in the same way as files
  if (message.type === 'dir-dependency' && process.env.ROLLUP_WATCH === 'true') {
    message = { type: 'dependency', file: message.dir }
  }

  return message
}
