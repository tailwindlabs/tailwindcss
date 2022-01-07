function partitionRules(root) {
  if (!root.walkAtRules) return [root]

  let applyParents = new Set()
  let rules = []

  root.walkAtRules('apply', (rule) => {
    applyParents.add(rule.parent)
  })

  if (applyParents.size === 0) {
    rules.push(root)
  }

  for (let rule of applyParents) {
    let nodeGroups = []
    let lastGroup = []

    for (let node of rule.nodes) {
      if (node.type === 'atrule' && node.name === 'apply') {
        if (lastGroup.length > 0) {
          nodeGroups.push(lastGroup)
          lastGroup = []
        }
        nodeGroups.push([node])
      } else {
        lastGroup.push(node)
      }
    }

    if (lastGroup.length > 0) {
      nodeGroups.push(lastGroup)
    }

    if (nodeGroups.length === 1) {
      rules.push(rule)
      continue
    }

    for (let group of [...nodeGroups].reverse()) {
      let clone = rule.clone({ nodes: [] })
      clone.append(group)
      rules.unshift(clone)
      rule.after(clone)
    }

    rule.remove()
  }

  return rules
}

export default function expandApplyAtRules() {
  return (root) => {
    partitionRules(root)
  }
}
