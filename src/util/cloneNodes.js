export default function cloneNodes(nodes, source = undefined, raws = undefined) {
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

    if (raws !== undefined) {
      cloned.raws.tailwind = {
        ...cloned.raws.tailwind,
        ...raws,
      }
    }

    return cloned
  })
}
