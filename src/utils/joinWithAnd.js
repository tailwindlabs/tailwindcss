export function joinWithAnd(strs) {
  return strs.reduce((acc, cur, i) => {
    if (i === 0) return cur
    if (i === strs.length - 1) return `${acc} and ${cur}`
    return `${acc}, ${cur}`
  }, '')
}
