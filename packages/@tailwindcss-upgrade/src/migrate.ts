import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { formatNodes } from './codemods/format-nodes'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { migrateAtLayerUtilities } from './codemods/migrate-at-layer-utilities'
import { migrateMissingLayers } from './codemods/migrate-missing-layers'
import { migrateTailwindDirectives } from './codemods/migrate-tailwind-directives'

export interface MigrateOptions {
  newPrefix: string | null
  designSystem: DesignSystem
  userConfig: Config
}

export async function migrateContents(contents: string, options: MigrateOptions, file?: string) {
  return postcss()
    .use(migrateAtApply(options))
    .use(migrateAtLayerUtilities())
    .use(migrateMissingLayers())
    .use(migrateTailwindDirectives(options))
    .use(formatNodes())
    .process(contents, { from: file })
    .then((result) => result.css)
}

export async function migrate(file: string, options: MigrateOptions) {
  let fullPath = path.resolve(process.cwd(), file)
  let contents = await fs.readFile(fullPath, 'utf-8')

  await fs.writeFile(fullPath, await migrateContents(contents, options, fullPath))
}
