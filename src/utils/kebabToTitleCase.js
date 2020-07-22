export function kebabToTitleCase(str) {
  return str.replace(/(?:^|-)([a-z])/gi, (m, p1) => ` ${p1.toUpperCase()}`).trim()
}
