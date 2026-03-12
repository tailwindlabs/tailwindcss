import path from 'node:path'

export function normalizeWindowsSeparators(p: string) {
  return path.sep === '\\' ? p.replaceAll('\\', '/') : p
}
