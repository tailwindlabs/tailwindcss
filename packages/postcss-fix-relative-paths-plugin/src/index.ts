import path from 'node:path'
import type { AtRule, Container, Plugin } from 'postcss'

export default function fixRelativePathsPlugin(): Plugin {
  return {
    postcssPlugin: 'tailwindcss-postcss-import',
    AtRule: {
      content: fixRelativePath,
      plugin: fixRelativePath,
    },
  }
}

function fixRelativePath(atRule: AtRule, helpers: any) {
  let rootPath = getRoot(atRule)?.source?.input.file
  if (!rootPath) {
    return
  }

  let inputFilePath = atRule?.source?.input.file
  if (!inputFilePath) {
    return
  }

  let value = atRule.params[0]

  let quote =
    value[0] === '"' && value[value.length - 1] === '"'
      ? '"'
      : value[0] === "'" && value[value.length - 1] === "'"
        ? "'"
        : null
  if (!quote) {
    return
  }
  let content = atRule.params.slice(1, -1)

  // We only want to rewrite relative paths.
  if (!content.startsWith('./') && !content.startsWith('../')) {
    return
  }

  // TODO: handle escaped quotes?
  let rulePath = path.join(path.dirname(inputFilePath), content)

  atRule.params = quote + path.relative(path.dirname(rootPath), rulePath) + quote
}

function getRoot(node: AtRule | Container | undefined): Container | undefined {
  if (node?.parent) {
    return getRoot(node.parent as Container)
  }
  return node
}
