export function castArray(value) {
  return Array.isArray(value) ? value : [value]
}
