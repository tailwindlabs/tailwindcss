const IS_WINDOWS = process.platform === 'win32'

/**
 * Compare two file paths for equality. On Windows, the comparison is
 * case-insensitive because the filesystem is case-insensitive.
 */
export function pathsEqual(a: string, b: string): boolean {
  if (IS_WINDOWS) {
    return a.toLowerCase() === b.toLowerCase()
  }
  return a === b
}
