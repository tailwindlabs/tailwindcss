export function clearRequireCache(files: string[]) {
  for (let key of files) {
    delete require.cache[key]
  }
}
