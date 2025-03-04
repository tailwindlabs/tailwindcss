import { compile, Features, normalizePath } from '@tailwindcss/node'
import { nativeBinding, Scanner, twctxCreate, twctxIsDirty, twctxToJs } from '@tailwindcss/oxide'
import type { BunPlugin } from 'bun'
import fs from 'node:fs/promises'
import * as path from 'path'

const addon = nativeBinding

const SPECIAL_QUERY_RE = /[?&](raw|url)\b/

const NON_CSS_ROOT_FILE_RE =
  /(?:\/\.vite\/|(?!\.css$|\.vue\?.*&lang\.css|\.astro\?.*&lang\.css|\.svelte\?.*&lang\.css).*|\?(?:raw|url)\b)/

type Compiler = Awaited<ReturnType<typeof compile>>

const plugin: BunPlugin = {
  name: 'tailwindcss',
  setup(build) {
    const external = twctxCreate()

    let moduleGraphCandidates = new Map<string, Set<string>>()
    function getSharedCandidates() {
      if (twctxIsDirty(external)) {
        let rawCandidates: Array<{ id: string; candidates: string[] }> = twctxToJs(external)
        for (let { id, candidates } of rawCandidates) {
          moduleGraphCandidates.set(id, new Set(candidates))
        }
      }
      return moduleGraphCandidates
    }

    // @ts-ignore
    build.onBeforeParse(
      { filter: NON_CSS_ROOT_FILE_RE },
      { napiModule: addon, symbol: 'tw_on_before_parse', external },
    )

    build.onLoad({ filter: /\.css/ }, async ({ defer, path: inputPath }) => {
      if (!isPotentialCssRootFile(inputPath)) return

      let inputBaseForRoot = path.dirname(path.resolve(inputPath))

      let sourceContents = await Bun.file(inputPath).text()
      let compiler = await compile(sourceContents, {
        base: inputBaseForRoot,
        onDependency(path) {
          // TODO: Bun does not currently have a bundler API which is
          // analogous to `.addWatchFile()`.
        },
      })

      // Wait until the native plugin has scanned all files in
      // the module graph.
      await defer()

      let candidates = new Set<string>()
      let basePath: string | null = null

      let sources = (() => {
        // Disable auto source detection
        if (compiler.root === 'none') {
          return []
        }

        // No root specified, use the module graph
        if (compiler.root === null) {
          return []
        }

        // Use the specified root
        return [compiler.root]
      })().concat(compiler.globs)

      let scanner = new Scanner({ sources })

      if (
        !(
          compiler.features &
          (Features.AtApply | Features.JsPluginCompat | Features.ThemeFunction | Features.Utilities)
        )
      ) {
        return undefined
      }

      for (let candidate of scanner.scan()) {
        candidates.add(candidate)
      }

      if (compiler.features & Features.Utilities) {
        // TODO: Watch individual files found via custom `@source` paths
        // Bun does not currently have a bundler API which is
        // analogous to `.addWatchFile()`, but this is where
        // we would handle @source
        // Watch globs found via custom `@source` paths
        for (let glob of scanner.globs) {
          /* TODO: addWatchFile
          if (glob.pattern[0] === '!') continue

          let relative = path.relative(this.base, glob.base)
          if (relative[0] !== '.') {
            relative = './' + relative
          }
          // Ensure relative is a posix style path since we will merge it with the
          // glob.
          relative = normalizePath(relative)

          addWatchFile(path.posix.join(relative, glob.pattern))
          */

          let root = compiler.root

          if (root !== 'none' && root !== null) {
            let newBasePath = normalizePath(path.resolve(root.base, root.pattern))

            let isDir = await fs.stat(newBasePath).then(
              (stats) => stats.isDirectory(),
              () => false,
            )

            if (!isDir) {
              throw new Error(
                `The path given to \`source(…)\` must be a directory but got \`source(${newBasePath})\` instead.`,
              )
            }

            basePath = newBasePath
          } else if (root === null) {
            basePath = null
          }
        }
      }

      let contents = compiler.build([
        ...sharedCandidates(compiler, basePath, getSharedCandidates),
        ...candidates,
      ])

      return {
        // Return directly to Bun's bundler which will optimize the CSS
        contents,
        loader: 'css',
      }
    })
  },
}

export default plugin

function sharedCandidates(
  compiler: Compiler,
  basePath: string | null,
  getSharedCandidates: () => Map<string, Set<string>>,
): Set<string> {
  if (compiler.root === 'none') return new Set()

  const HAS_DRIVE_LETTER = /^[A-Z]:/

  let shouldIncludeCandidatesFrom = (id: string) => {
    if (basePath === null) return true

    if (id.startsWith(basePath)) return true

    // This is a windows absolute path that doesn't match so return false
    if (HAS_DRIVE_LETTER.test(id)) return false

    // We've got a path that's not absolute and not on Windows
    // TODO: this is probably a virtual module -- not sure if we need to scan it
    if (!id.startsWith('/')) return true

    // This is an absolute path on POSIX and it does not match
    return false
  }

  let shared = new Set<string>()

  for (let [id, candidates] of getSharedCandidates()) {
    if (!shouldIncludeCandidatesFrom(id)) continue

    for (let candidate of candidates) {
      shared.add(candidate)
    }
  }

  return shared
}

function isPotentialCssRootFile(id: string) {
  if (id.includes('/.vite/')) return
  let extension = getExtension(id)
  let isCssFile =
    (extension === 'css' ||
      (extension === 'vue' && id.includes('&lang.css')) ||
      (extension === 'astro' && id.includes('&lang.css')) ||
      // We want to process Svelte `<style>` tags to properly add dependency
      // tracking for imported files.
      isSvelteStyle(id)) &&
    // Don't intercept special static asset resources
    !SPECIAL_QUERY_RE.test(id)

  return isCssFile
}

function getExtension(id: string) {
  let [filename] = id.split('?', 2)
  return path.extname(filename).slice(1)
}

function isSvelteStyle(id: string) {
  let extension = getExtension(id)
  return extension === 'svelte' && id.includes('&lang.css')
}
