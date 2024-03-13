import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import atImport from 'postcss-import'
import prettier from 'prettier'

// Performance optimization: Inline the contents of the `tailwindcss/index.css`
// file so that we don't need to handle imports at runtime.
{
  let __dirname = path.dirname(new URL(import.meta.url).pathname)
  let file = path.resolve(__dirname, '../packages/tailwindcss/index.css')
  let contents = await fs.readFile(file, 'utf-8')
  let inlined = await prettier.format(
    await postcss()
      .use(atImport())
      .process(contents, { from: file })
      .then((result) => result.css),
    { filepath: file },
  )
  await fs.writeFile(file, inlined, 'utf-8')
}
