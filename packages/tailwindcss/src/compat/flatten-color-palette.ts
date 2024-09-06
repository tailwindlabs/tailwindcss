type Colors = {
  [key: string | number]: string | Colors
}

export function flattenColorPalette(colors: Colors) {
  let result: Record<string, string> = {}

  for (let [root, children] of Object.entries(colors ?? {})) {
    if (typeof children === 'object' && children !== null) {
      for (let [parent, value] of Object.entries(flattenColorPalette(children))) {
        result[`${root}${parent === 'DEFAULT' ? '' : `-${parent}`}`] = value
      }
    } else {
      result[root] = children
    }
  }

  return result
}
