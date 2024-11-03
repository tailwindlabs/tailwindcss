import postcss, { type ChildNode, type Plugin, type Root } from 'postcss'
import { format } from 'prettier'
import { walk } from '../utils/walk'

// Prettier is used to generate cleaner output, but it's only used on the nodes
// that were marked as `pretty` during the migration.
export function formatNodes(): Plugin {
  async function migrate(root: Root) {
    // Find the nodes to format
    let nodesToFormat: ChildNode[] = []
    walk(root, (child, _idx, parent) => {
      // Always print semicolons after at-rules
      if (child.type === 'atrule') {
        child.raws.semicolon = true
      }

      if (child.type === 'atrule' && child.name === 'bucket') {
        nodesToFormat.push(child)
      } else if (child.raws.tailwind_pretty) {
        // @ts-expect-error We might not have a parent
        child.parent ??= parent
        nodesToFormat.unshift(child)
      }
    })

    let output: string[] = []

    // Format the nodes
    for (let node of nodesToFormat) {
      let contents = (() => {
        if (node.type === 'atrule' && node.name === 'bucket') {
          // Remove the `@bucket` wrapping, and use the contents directly.
          return node
            .toString()
            .trim()
            .replace(/@bucket(.*?){([\s\S]*)}/, '$2')
        }

        return node.toString()
      })()

      // Do not format the user bucket to ensure we keep the user's formatting
      // intact.
      if (node.type === 'atrule' && node.name === 'bucket' && node.params === 'user') {
        output.push(contents)
        continue
      }

      // Format buckets
      if (node.type === 'atrule' && node.name === 'bucket') {
        output.push(await format(contents, { parser: 'css', semi: true, singleQuote: true }))
        continue
      }

      // Format any other nodes
      node.replaceWith(
        postcss.parse(
          `${node.raws.before ?? ''}${(await format(contents, { parser: 'css', semi: true, singleQuote: true })).trim()}`,
        ),
      )
    }

    root.removeAll()
    root.append(
      postcss.parse(
        output
          .map((bucket) => bucket.trim())
          .filter(Boolean)
          .join('\n\n'),
      ),
    )
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/format-nodes',
    OnceExit: migrate,
  }
}
