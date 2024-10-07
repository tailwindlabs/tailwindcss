import { AtRule, type ChildNode, type Plugin, type Root } from 'postcss'

export function migrateMissingLayers(): Plugin {
  function migrate(root: Root) {
    let lastLayer = ''
    let bucket: ChildNode[] = []
    let buckets: [layer: string, bucket: typeof bucket][] = []
    let firstLayerName: string | null = null

    root.each((node) => {
      if (node.type === 'atrule') {
        // Known Tailwind directives that should not be inside a layer.
        if (node.name === 'theme' || node.name === 'utility') {
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
          if (lastLayer !== '' && !node.params.includes('layer(')) {
            node.params += ` layer(${lastLayer})`
          }

          if (bucket.length > 0) {
            buckets.push([lastLayer, bucket.splice(0)])
          }
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

    // Wrap each bucket in an `@layer` at-rule
    for (let [layerName, nodes] of buckets) {
      let targetLayerName = layerName || firstLayerName || ''
      if (targetLayerName === '') {
        continue
      }

      // Do not wrap comments in a layer, if they are the only nodes.
      if (nodes.every((node) => node.type === 'comment')) {
        continue
      }

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
