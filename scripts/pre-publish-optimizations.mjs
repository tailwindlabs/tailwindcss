import fs from 'node:fs'
import path from 'node:path'

// 1. Performance optimization: Inline the contents of the
//    `tailwindcss/index.css` file so that we don't require to handle imports at
//    runtime.
{
  let __dirname = path.dirname(new URL(import.meta.url).pathname)
  let file = path.resolve(__dirname, '../packages/tailwindcss/index.css')
  let inlined = inline(file)
  fs.writeFileSync(file, inlined, 'utf-8')

  // Recursively inlines `@import` statements in the given file.
  function inline(file) {
    let contents = fs.readFileSync(file, 'utf-8')
    if (!contents.includes('@import')) return contents

    let dirname = path.dirname(file)

    return contents.replace(/@import (["'])(.*?)\1(.*);/g, (_, _quote, importee, additional) => {
      let contents = inline(path.resolve(dirname, importee)).trim()

      if (additional.trim()) {
        let layerMatch = /layer\((.*)\)/g.exec(additional)
        if (layerMatch) {
          return `@layer ${layerMatch[1]} {${contents}}`
        }

        return `@media (${additional.trim()}) {${contents}}`
      }

      return inline(path.resolve(dirname, importee))
    })
  }
}
