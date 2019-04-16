function indentRecursive(node, indentLevel = 0) {
  node.each && node.each((child, i) => {
    if (!child.raws.before || child.raws.before.includes('\n')) {
      child.raws.before = `${ node.type === 'rule' || i === 0 ? '\n' : '\n\n'}${'  '.repeat(indentLevel)}`
    }
    child.raws.after = `\n${'  '.repeat(indentLevel)}`
    indentRecursive(child, indentLevel + 1)
  })
}

export default function formatNodes(root) {
  indentRecursive(root)
  root.first.raws.before = ''
}
