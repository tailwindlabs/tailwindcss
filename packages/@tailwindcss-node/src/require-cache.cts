export function clearRequireCache() {
  for (const key in require.cache) {
    delete require.cache[key]
  }
}
