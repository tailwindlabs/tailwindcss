import groupBy from 'just-group-by'

export function numbersFirst(classes) {
  return [...classes].sort((a, b) => {
    let aNum = a
      .split(/\s+/)[0]
      .replace(/\\/g, '')
      .match(/-([0-9.]+)$/)
    aNum = aNum === null ? NaN : parseFloat(aNum[1])
    let bNum = b
      .split(/\s+/)[0]
      .replace(/\\/g, '')
      .match(/-([0-9.]+)$/)
    bNum = bNum === null ? NaN : parseFloat(bNum[1])
    if (isNaN(aNum) && isNaN(bNum)) return 0
    if (isNaN(aNum)) return 1
    if (isNaN(bNum)) return -1
    return aNum - bNum
  })
}

export function numbersFirstByPrefix(classes) {
  return Object.values(groupBy(classes, (c) => c.match(/^(.*?)[^-]+$/)[1])).flatMap(numbersFirst)
}
