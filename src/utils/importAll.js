export function importAll(r) {
  return r.keys().map((fileName) => ({
    fileName,
    module: r(fileName),
  }))
}
