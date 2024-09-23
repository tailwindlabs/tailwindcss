// Inlined version of `normalize-path` <https://github.com/jonschlinkert/normalize-path>
// Copyright (c) 2014-2018, Jon Schlinkert.
// Released under the MIT License.
function normalizePathBase(path: string, stripTrailing?: boolean) {
  if (typeof path !== 'string') {
    throw new TypeError('expected path to be a string')
  }

  if (path === '\\' || path === '/') return '/'

  var len = path.length
  if (len <= 1) return path

  // ensure that win32 namespaces has two leading slashes, so that the path is
  // handled properly by the win32 version of path.parse() after being normalized
  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
  var prefix = ''
  if (len > 4 && path[3] === '\\') {
    var ch = path[2]
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2)
      prefix = '//'
    }
  }

  var segs = path.split(/[/\\]+/)
  if (stripTrailing !== false && segs[segs.length - 1] === '') {
    segs.pop()
  }
  return prefix + segs.join('/')
}

export function normalizePath(originalPath: string) {
  let normalized = normalizePathBase(originalPath)

  // Make sure Windows network share paths are normalized properly
  // They have to begin with two slashes or they won't resolve correctly
  if (
    originalPath.startsWith('\\\\') &&
    normalized.startsWith('/') &&
    !normalized.startsWith('//')
  ) {
    return `/${normalized}`
  }

  return normalized
}
