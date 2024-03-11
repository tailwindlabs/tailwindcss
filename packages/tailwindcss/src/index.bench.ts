import { scanDir } from '@tailwindcss/oxide'
import { bench } from 'vitest'
import { compile } from '.'

// FOLDER=path/to/folder vitest bench
const root = process.env.FOLDER || process.cwd()
const css = String.raw

bench('compile', async () => {
  let { candidates } = scanDir({ base: root, globs: true })

  compile(css`
    @tailwind utilities;
  `).build(candidates)
})
