import { parse, type ChildNode, type Plugin, type Root } from 'postcss'
import { format } from 'prettier'
import { walk, WalkAction } from '../utils/walk'

// Prettier is used to generate cleaner output, but it's only used on the nodes
// that were marked as `pretty` during the migration.
export function formatNodes(): Plugin {
  async function migrate(root: Root) {
    // Find the nodes to format
    let nodesToFormat: ChildNode[] = []
    walk(root, (child) => {
      if (child.raws.tailwind_pretty) {
        nodesToFormat.push(child)
        return WalkAction.Skip
      }
    })

    // Format the nodes
    await Promise.all(
      nodesToFormat.map(async (node) => {
        node.replaceWith(
          parse(
            await format(node.toString(), {
              parser: 'css',
              semi: true,
              singleQuote: true,
            }),
          ),
        )
      }),
    )
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/format-nodes',
    OnceExit: migrate,
  }
}
