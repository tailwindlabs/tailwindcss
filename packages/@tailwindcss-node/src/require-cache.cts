export function clearRequireCache(files: string[]) {
  for (const key of files) {
    delete require.cache[key]
  }
}
