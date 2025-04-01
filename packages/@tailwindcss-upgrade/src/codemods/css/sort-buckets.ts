import postcss, { type AtRule, type ChildNode, type Comment, type Plugin, type Root } from 'postcss'
import { DefaultMap } from '../../../../tailwindcss/src/utils/default-map'
import { walk, WalkAction } from '../../utils/walk'

const BUCKET_ORDER = [
  // Imports
  'import', // @import

  // Configuration
  'config', // @config
  'plugin', // @plugin
  'source', // @source
  'custom-variant', // @custom-variant
  'theme', // @theme

  // Styles
  'compatibility', // @layer base with compatibility CSS
  'utility', // @utility

  // User CSS
  'user',
]

export function sortBuckets(): Plugin {
  async function migrate(root: Root) {
    // 1. Move items that are not in a bucket, into a bucket
    {
      let comments: Comment[] = []

      let buckets = new DefaultMap<string, AtRule>((name) => {
        let bucket = postcss.atRule({ name: 'tw-bucket', params: name, nodes: [] })
        root.append(bucket)
        return bucket
      })

      // Seed the buckets with existing buckets
      root.walkAtRules('tw-bucket', (node) => {
        buckets.set(node.params, node)
      })

      let lastLayer = 'user'
      function injectInto(name: string, ...nodes: ChildNode[]) {
        lastLayer = name
        buckets.get(name).nodes?.push(...comments.splice(0), ...nodes)
      }

      walk(root, (node) => {
        // Already in a bucket, skip it
        if (node.type === 'atrule' && node.name === 'tw-bucket') {
          return WalkAction.Skip
        }

        // Comments belong to the bucket of the nearest node, which is typically
        // in the "next" bucket.
        if (node.type === 'comment') {
          // We already have comments, which means that we already have nodes
          // that belong in the next bucket, so we should move the current
          // comment into the next bucket as well.
          if (comments.length > 0) {
            comments.push(node)
            return
          }

          // Figure out the closest node to the comment
          let prevDistance = distance(node.prev(), node) ?? Infinity
          let nextDistance = distance(node, node.next()) ?? Infinity

          if (prevDistance < nextDistance) {
            buckets.get(lastLayer).nodes?.push(node)
          } else {
            comments.push(node)
          }
        }

        // Known at-rules
        else if (
          node.type === 'atrule' &&
          ['config', 'plugin', 'source', 'theme', 'utility', 'custom-variant'].includes(node.name)
        ) {
          injectInto(node.name, node)
        }

        // Imports bucket, which also contains the `@charset` and body-less `@layer`
        else if (
          (node.type === 'atrule' && node.name === 'layer' && !node.nodes) || // @layer foo, bar;
          (node.type === 'atrule' && node.name === 'import') ||
          (node.type === 'atrule' && node.name === 'charset') || // @charset "UTF-8";
          (node.type === 'atrule' && node.name === 'tailwind')
        ) {
          injectInto('import', node)
        }

        // User CSS
        else if (node.type === 'rule' || node.type === 'atrule') {
          injectInto('user', node)
        }

        // Fallback
        else {
          injectInto('user', node)
        }

        return WalkAction.Skip
      })

      if (comments.length > 0) {
        injectInto(lastLayer)
      }
    }

    // 2. Merge `@tw-bucket` with the same name together
    let firstBuckets = new Map<string, AtRule>()
    root.walkAtRules('tw-bucket', (node) => {
      let firstBucket = firstBuckets.get(node.params)
      if (!firstBucket) {
        firstBuckets.set(node.params, node)
        return
      }

      if (node.nodes) {
        firstBucket.append(...node.nodes)
      }
    })

    // 3. Remove empty `@tw-bucket`
    root.walkAtRules('tw-bucket', (node) => {
      if (!node.nodes?.length) {
        node.remove()
      }
    })

    // 4. Sort the `@tw-bucket` themselves
    {
      let sorted = Array.from(firstBuckets.values()).sort((a, z) => {
        let aIndex = BUCKET_ORDER.indexOf(a.params)
        let zIndex = BUCKET_ORDER.indexOf(z.params)
        return aIndex - zIndex
      })

      // Re-inject the sorted buckets
      root.removeAll()
      root.append(sorted)
    }
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/sort-buckets',
    OnceExit: migrate,
  }
}

function distance(before?: ChildNode, after?: ChildNode): number | null {
  if (!before || !after) return null
  if (!before.source || !after.source) return null
  if (!before.source.start || !after.source.start) return null
  if (!before.source.end || !after.source.end) return null

  // Compare end of Before, to start of After
  let d = Math.abs(before.source.end.line - after.source.start.line)
  return d
}
