export function clearRequireCache(files: string[]) {
  if (!(typeof require === 'function' && require.cache)) {
    return
  }

  for (let key of files) {
    delete require.cache[key]
  }
}
