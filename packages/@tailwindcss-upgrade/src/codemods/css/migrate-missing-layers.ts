import { AtRule, type ChildNode, type Plugin, type Root } from 'postcss'
import { segment } from '../../../../tailwindcss/src/utils/segment'

export function migrateMissingLayers(): Plugin {
  function migrate(root: Root) {
    let lastLayer = ''
    let bucket: ChildNode[] = []
    let buckets: [layer: string, bucket: typeof bucket][] = []
    let firstLayerName: string | null = null

    root.each((node) => {
      if (node.type === 'atrule') {
        // Known Tailwind directives that should not be inside a layer.
        if (
          node.name === 'config' ||
          node.name === 'source' ||
          node.name === 'theme' ||
          node.name === 'utility' ||
          node.name === 'custom-variant' ||
          node.name === 'variant'
        ) {
          if (bucket.length > 0) {
            buckets.push([lastLayer, bucket.splice(0)])
          }
          return
        }

        // Base
        if (
          (node.name === 'tailwind' && node.params === 'base') ||
          (node.name === 'import' && node.params.match(/^["']tailwindcss\/base["']/))
        ) {
          if (bucket.length > 0) {
            buckets.push([lastLayer, bucket.splice(0)])
          }

          firstLayerName ??= 'base'
          lastLayer = 'base'
          return
        }

        // Components
        if (
          (node.name === 'tailwind' && node.params === 'components') ||
          (node.name === 'import' && node.params.match(/^["']tailwindcss\/components["']/))
        ) {
          if (bucket.length > 0) {
            buckets.push([lastLayer, bucket.splice(0)])
          }

          firstLayerName ??= 'components'
          lastLayer = 'components'
          return
        }

        // Utilities
        if (
          (node.name === 'tailwind' && node.params === 'utilities') ||
          (node.name === 'import' && node.params.match(/^["']tailwindcss\/utilities["']/))
        ) {
          if (bucket.length > 0) {
            buckets.push([lastLayer, bucket.splice(0)])
          }

          firstLayerName ??= 'utilities'
          lastLayer = 'utilities'
          return
        }

        // Already in a layer
        if (node.name === 'layer') {
          if (bucket.length > 0) {
            buckets.push([lastLayer, bucket.splice(0)])
          }
          return
        }

        // Add layer to `@import` at-rules
        if (node.name === 'import') {
          if (bucket.length > 0) {
            buckets.push([lastLayer, bucket.splice(0)])
          }

          // Create new bucket just for the import. This way every import exists
          // in its own layer which allows us to add the `layer(…)` parameter
          // later on.
          buckets.push([lastLayer, [node]])
          return
        }
      }

      // (License) comments, body-less `@layer` and `@charset` can stay at the
      // top, when we haven't found any `@tailwind` at-rules yet.
      if (
        lastLayer === '' &&
        (node.type === 'comment' /* Comment */ ||
          (node.type === 'atrule' && !node.nodes) || // @layer foo, bar, baz;
          (node.type === 'atrule' && node.name === 'charset')) // @charset "UTF-8";
      ) {
        return
      }

      // Track the node
      bucket.push(node)
    })

    for (let [layerName, nodes] of buckets) {
      let targetLayerName = layerName || firstLayerName || ''
      if (targetLayerName === '') {
        continue
      }

      // Do not wrap comments in a layer, if they are the only nodes.
      if (nodes.every((node) => node.type === 'comment')) {
        continue
      }

      // Add `layer(…)` to `@import` at-rules
      if (nodes.every((node) => node.type === 'atrule' && node.name === 'import')) {
        for (let node of nodes) {
          if (node.type !== 'atrule' || node.name !== 'import') continue

          if (!node.params.includes('layer(')) {
            let params = segment(node.params, ' ')
            params.splice(1, 0, `layer(${targetLayerName})`)
            node.params = params.join(' ')
            node.raws.tailwind_injected_layer = true
          }
        }
        continue
      }

      // Wrap each bucket in an `@layer` at-rule
      let target = nodes[0]
      let layerNode = new AtRule({
        name: 'layer',
        params: targetLayerName,
        nodes: nodes.map((node) => {
          // Keep the target node as-is, because we will be replacing that one
          // with the new layer node.
          if (node === target) {
            return node
          }

          // Every other node should be removed from its original position. They
          // will be added to the new layer node.
          return node.remove()
        }),
        raws: {
          tailwind_pretty: true,
        },
      })
      target.replaceWith(layerNode)
    }
  }

  return {
    postcssPlugin: '@tailwindcss/upgrade/migrate-missing-layers',
    OnceExit: migrate,
  }
}
