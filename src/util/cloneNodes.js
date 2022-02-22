export default function cloneNodes(nodes, source) {
  return nodes.map((node) => {
    let cloned = node.clone()

    if (source !== undefined) {
      cloned.source = source

      if ('walk' in cloned) {
        cloned.walk((child) => {
          child.source = source
        })
      }
    }

    return cloned
  })
}
