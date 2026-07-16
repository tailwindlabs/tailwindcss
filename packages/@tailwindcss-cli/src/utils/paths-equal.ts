const IS_WINDOWS = process.platform === 'win32'

export function pathsEqual(a: string, b: string): boolean {
  if (IS_WINDOWS) {
    return a.toLowerCase() === b.toLowerCase()
  }
  return a === b
}
