import path from 'node:path'

export function normalizeWindowsSeperators(p: string) {
  return path.sep === '\\' ? p.replaceAll('\\', '/') : p
}
