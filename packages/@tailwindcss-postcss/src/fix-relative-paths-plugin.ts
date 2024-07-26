import path from 'node:path'
import type { AtRule, Container, Plugin } from 'postcss'

export function fixRelativePathsPlugin(): Plugin {
  return {
    postcssPlugin: 'tailwindcss-postcss-import',
    AtRule: {
      content: fixRelativePath,
      plugin: fixRelativePath,
    },
  }
}

function fixRelativePath(atRule: AtRule, helpers: any) {
  const rootPath = getRoot(atRule)?.source?.input.file
  if (!rootPath) {
    return
  }

  const inputFilePath = atRule?.source?.input.file
  if (!inputFilePath) {
    return
  }

  const content = atRule.params[0]

  const quote =
    content[0] === '"' && content[content.length - 1] === '"'
      ? '"'
      : content[0] === "'" && content[content.length - 1] === "'"
        ? "'"
        : null
  if (!quote) {
    return
  }

  // TODO: handle escaped quotes?
  const rulePath = path.join(path.dirname(inputFilePath), atRule.params.slice(1, -1))

  atRule.params = quote + path.relative(path.dirname(rootPath), rulePath) + quote
}

function getRoot(node: AtRule | Container | undefined): Container | undefined {
  if (node?.parent) {
    return getRoot(node.parent as Container)
  }
  return node
}
