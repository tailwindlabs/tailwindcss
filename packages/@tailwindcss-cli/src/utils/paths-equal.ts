/**
 * Compare two file paths for equality. On Windows, the comparison is
 * case-insensitive because the filesystem is case-insensitive.
 */
export function pathsEqual(
  a: string,
  b: string,
  platform: NodeJS.Platform = process.platform,
): boolean {
  if (platform === 'win32') {
    return a.toLowerCase() === b.toLowerCase()
  }
  return a === b
}
