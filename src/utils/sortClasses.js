import groupBy from 'just-group-by'

export function numbersFirst(classes) {
  return [...classes].sort((a, b) => {
    a = a.endsWith('-px') ? a.replace(/-px$/, '-0.25') : a
    b = b.endsWith('-px') ? b.replace(/-px$/, '-0.25') : b

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

export function numbersLast(classes) {
  return [...classes].sort((a, b) => {
    a = a.endsWith('-px') ? a.replace(/-px$/, '-0.25') : a
    b = b.endsWith('-px') ? b.replace(/-px$/, '-0.25') : b

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
    if (isNaN(aNum)) return -1
    if (isNaN(bNum)) return 1
    return aNum - bNum
  })
}

export function negativeLast(classes) {
  return [...classes].sort((a, b) => {
    if (a.startsWith('.-') && b.startsWith('.-')) {
      return 0
    }
    if (a.startsWith('.-')) {
      return 1
    }
    if (b.startsWith('.-')) {
      return -1
    }
    return 0
  })
}
