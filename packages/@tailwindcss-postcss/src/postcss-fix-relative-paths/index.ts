import { normalizePath } from '@tailwindcss/node'
import path from 'node:path'
import type { AtRule, Plugin } from 'postcss'

const SINGLE_QUOTE = "'"
const DOUBLE_QUOTE = '"'

export default function fixRelativePathsPlugin(): Plugin {
  // Retain a list of touched at-rules to avoid infinite loops
  let touched: WeakSet<AtRule> = new WeakSet()

  function fixRelativePath(atRule: AtRule) {
    let rootPath = atRule.root().source?.input.file
    if (!rootPath) {
      return
    }

    let inputFilePath = atRule.source?.input.file
    if (!inputFilePath) {
      return
    }

    if (touched.has(atRule)) {
      return
    }

    let value = atRule.params[0]

    let quote =
      value[0] === DOUBLE_QUOTE && value[value.length - 1] === DOUBLE_QUOTE
        ? DOUBLE_QUOTE
        : value[0] === SINGLE_QUOTE && value[value.length - 1] === SINGLE_QUOTE
          ? SINGLE_QUOTE
          : null
    if (!quote) {
      return
    }
    let glob = atRule.params.slice(1, -1)

    // Handle eventual negative rules. We only support one level of negation.
    let negativePrefix = ''
    if (glob.startsWith('!')) {
      glob = glob.slice(1)
      negativePrefix = '!'
    }

    // We only want to rewrite relative paths.
    if (!glob.startsWith('./') && !glob.startsWith('../')) {
      return
    }

    let absoluteGlob = path.posix.join(normalizePath(path.dirname(inputFilePath)), glob)
    let absoluteRootPosixPath = path.posix.dirname(normalizePath(rootPath))

    let relative = path.posix.relative(absoluteRootPosixPath, absoluteGlob)

    // If the path points to a file in the same directory, `path.relative` will
    // remove the leading `./` and we need to add it back in order to still
    // consider the path relative
    if (!relative.startsWith('.')) {
      relative = './' + relative
    }

    atRule.params = quote + negativePrefix + relative + quote
    touched.add(atRule)
  }

  return {
    postcssPlugin: 'tailwindcss-postcss-fix-relative-paths',
    Once(root) {
      root.walkAtRules(/source|plugin|config/, fixRelativePath)
    },
  }
}
