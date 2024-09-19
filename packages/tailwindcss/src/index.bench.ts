import { Scanner } from '@tailwindcss/oxide'
import { bench } from 'vitest'
import { compile } from '.'

// FOLDER=path/to/folder vitest bench
const root = process.env.FOLDER || process.cwd()
const css = String.raw

bench('compile', async () => {
  let scanner = new Scanner({ detectSources: { base: root } })
  let candidates = scanner.scan()

  let { build } = await compile(
    css`
      @tailwind utilities;
    `,
    root,
  )

  build(candidates)
})
