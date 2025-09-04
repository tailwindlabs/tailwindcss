export function topologicalSort<Key>(
  graph: Map<Key, Set<Key>>,
  options: { onCircularDependency: (path: Key[], start: Key) => void },
): Key[] {
  let seen = new Set<Key>()
  let wip = new Set<Key>()

  let sorted: Key[] = []

  function visit(node: Key, path: Key[] = []) {
    if (!graph.has(node)) return
    if (seen.has(node)) return

    // Circular dependency detected
    if (wip.has(node)) options.onCircularDependency?.(path, node)

    wip.add(node)

    for (let dependency of graph.get(node) ?? []) {
      path.push(node)
      visit(dependency, path)
      path.pop()
    }

    seen.add(node)
    wip.delete(node)

    sorted.push(node)
  }

  for (let node of graph.keys()) {
    visit(node)
  }

  return sorted
}
