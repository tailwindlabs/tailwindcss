import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import pc from 'picocolors'
import postcss from 'postcss'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { eprintln, wordWrap } from './utils/renderer'

export async function migrateContents(contents: string, file?: string) {
  return postcss()
    .use(migrateAtApply())
    .process(contents, { from: file })
    .then((result) => result.css)
}

export async function migrate(file: string) {
  let fullPath = path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(fullPath, await migrateContents(contents, fullPath))

  let stdout = execSync('git status --porcelain', { encoding: 'utf-8' })
  if (stdout.trim()) {
    wordWrap(
      'Migration complete. Verify the changes and commit them to your repository.',
      process.stderr.columns - 5 - 4,
    ).map((line) => eprintln(`${pc.green('\u2502')} ${line}`))
    eprintln()
  } else {
    wordWrap(
      'Migration complete. No changes were made to your repository.',
      process.stderr.columns - 5 - 4,
    ).map((line) => eprintln(`${pc.green('\u2502')} ${line}`))
    eprintln()
  }
}
