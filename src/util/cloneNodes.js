export default function cloneNodes(nodes, source) {
  return nodes.map((node) => {
    let cloned = node.clone()

    if (source !== undefined) {
      cloned.source = source
    }

    return cloned
  })
}
