export function toPath(path) {
  if (Array.isArray(path)) return path
  return path.split(/[\.\]\[]+/g)
}
