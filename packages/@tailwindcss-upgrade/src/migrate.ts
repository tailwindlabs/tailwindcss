import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { migrateTailwindDirectives } from './codemods/migrate-tailwind-directives'

export async function migrateContents(contents: string, file?: string) {
  return postcss()
    .use(migrateAtApply())
    .use(migrateTailwindDirectives())
    .process(contents, { from: file })
    .then((result) => result.css)
}

export async function migrate(file: string) {
  let fullPath = path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(fullPath, await migrateContents(contents, fullPath))
}
