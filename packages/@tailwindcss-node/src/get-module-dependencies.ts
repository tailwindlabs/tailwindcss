import fs from 'node:fs/promises'
import path from 'node:path'

// Patterns we use to match dependencies in a file whether in CJS, ESM, or TypeScript
const DEPENDENCY_PATTERNS = [
  /import[\s\S]*?['"](.{3,}?)['"]/gi,
  /import[\s\S]*from[\s\S]*?['"](.{3,}?)['"]/gi,
  /export[\s\S]*from[\s\S]*?['"](.{3,}?)['"]/gi,
  /require\(['"`](.+)['"`]\)/gi,
]

// Given the current file `a.ts`, we want to make sure that when importing `b` that we resolve
// `b.ts` before `b.js`
//
// E.g.:
//
// a.ts
//   b // .ts
//   c // .ts
// a.js
//   b // .js or .ts
const JS_EXTENSIONS = ['.js', '.cjs', '.mjs']
const JS_RESOLUTION_ORDER = ['', '.js', '.cjs', '.mjs', '.ts', '.cts', '.mts', '.jsx', '.tsx']
const TS_RESOLUTION_ORDER = ['', '.ts', '.cts', '.mts', '.tsx', '.js', '.cjs', '.mjs', '.jsx']

async function resolveWithExtension(file: string, extensions: string[]) {
  // Try to find `./a.ts`, `./a.cts`, ... from `./a`
  for (let ext of extensions) {
    let full = `${file}${ext}`

    let stats = await fs.stat(full).catch(() => null)
    if (stats?.isFile()) return full
  }

  // Try to find `./a/index.js` from `./a`
  for (let ext of extensions) {
    let full = `${file}/index${ext}`

    let exists = await fs.access(full).then(
      () => true,
      () => false,
    )
    if (exists) {
      return full
    }
  }

  return null
}

async function traceDependencies(
  seen: Set<string>,
  filename: string,
  base: string,
  ext: string,
): Promise<void> {
  // Try to find the file
  let extensions = JS_EXTENSIONS.includes(ext) ? JS_RESOLUTION_ORDER : TS_RESOLUTION_ORDER
  let absoluteFile = await resolveWithExtension(path.resolve(base, filename), extensions)
  if (absoluteFile === null) return // File doesn't exist

  // Prevent infinite loops when there are circular dependencies
  if (seen.has(absoluteFile)) return // Already seen

  // Mark the file as a dependency
  seen.add(absoluteFile)

  // Resolve new base for new imports/requires
  base = path.dirname(absoluteFile)
  ext = path.extname(absoluteFile)

  let contents = await fs.readFile(absoluteFile, 'utf-8')

  // Recursively trace dependencies in parallel
  let promises = []

  for (let pattern of DEPENDENCY_PATTERNS) {
    for (let match of contents.matchAll(pattern)) {
      // Bail out if it's not a relative file
      if (!match[1].startsWith('.')) continue

      promises.push(traceDependencies(seen, match[1], base, ext))
    }
  }

  await Promise.all(promises)
}

/**
 * Trace all dependencies of a module recursively
 *
 * The result is an unordered set of absolute file paths. Meaning that the order
 * is not guaranteed to be equal to source order or across runs.
 **/
export async function getModuleDependencies(absoluteFilePath: string) {
  let seen = new Set<string>()

  await traceDependencies(
    seen,
    absoluteFilePath,
    path.dirname(absoluteFilePath),
    path.extname(absoluteFilePath),
  )

  return Array.from(seen)
}
