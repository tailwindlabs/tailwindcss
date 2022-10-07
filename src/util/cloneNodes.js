export default function cloneNodes(nodes, source = undefined, raws = undefined) {
  return nodes.map((node) => {
    let cloned = node.clone()

    // We always want override the source map
    // except when explicitly told not to
    let shouldOverwriteSource = node.raws.tailwind?.preserveSource !== true || !cloned.source

    if (source !== undefined && shouldOverwriteSource) {
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
