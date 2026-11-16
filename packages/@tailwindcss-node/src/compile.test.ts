import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { expect, test } from 'vitest'
import { toCss } from '../../tailwindcss/src/ast'
import { parse } from '../../tailwindcss/src/css-parser'
import { compile, compileAst } from './compile'

// Creates a temporary folder that is removed once the variable goes out of
// scope, whether the test passes or fails.
async function createTempFolder() {
  let base = await mkdtemp(path.join(tmpdir(), 'tw-node'))
  return {
    base,
    [Symbol.asyncDispose]: () => rm(base, { recursive: true, force: true }),
  }
}

test('resolves an `@import` that failed to resolve in a previous compile once the file exists', async () => {
  await using folder = await createTempFolder()
  let { base } = folder
  let css = `@import './accent.css';`

  await expect(compile(css, { base, onDependency: () => {} })).rejects.toThrow(
    "Can't resolve './accent.css'",
  )

  await writeFile(path.join(base, 'accent.css'), '.accent { color: red; }')

  let compiler = await compile(css, { base, onDependency: () => {} })
  expect(compiler.build([])).toContain('.accent')

  // Once the file is removed again, the import fails again
  await rm(path.join(base, 'accent.css'))

  await expect(compile(css, { base, onDependency: () => {} })).rejects.toThrow(
    "Can't resolve './accent.css'",
  )
})

test('resolves an `@import` that failed to resolve in a previous `compileAst` once the file exists', async () => {
  await using folder = await createTempFolder()
  let { base } = folder
  let css = `@import './accent.css';`

  await expect(compileAst(parse(css), { base, onDependency: () => {} })).rejects.toThrow(
    "Can't resolve './accent.css'",
  )

  await writeFile(path.join(base, 'accent.css'), '.accent { color: red; }')

  let compiler = await compileAst(parse(css), { base, onDependency: () => {} })
  expect(toCss(compiler.build([]))).toContain('.accent')

  // Once the file is removed again, the import fails again
  await rm(path.join(base, 'accent.css'))

  await expect(compileAst(parse(css), { base, onDependency: () => {} })).rejects.toThrow(
    "Can't resolve './accent.css'",
  )
})
