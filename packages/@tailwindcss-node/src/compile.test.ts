import fs from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from 'vitest'
import { compile } from './compile'

test('source() accepts glob patterns with character classes', async () => {
  let base = await fs.mkdtemp(path.join(process.cwd(), '.tmp-tailwind-source-glob-'))

  try {
    await fs.mkdir(path.join(base, 'src'), { recursive: true })

    let compiler = await compile('@import "tailwindcss" source("./src/[a-z]/**/*.html");', {
      base,
      onDependency() {},
      customCssResolver(id) {
        if (id === 'tailwindcss') {
          return path.join(process.cwd(), 'packages/tailwindcss/index.css')
        }
      },
    })

    let css = compiler.build(['underline'])
    expect(css).toContain('.underline')
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
})
