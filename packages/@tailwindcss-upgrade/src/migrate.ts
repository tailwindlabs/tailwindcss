import postcss from 'postcss'
import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { migrateAtApply } from './codemods/migrate-at-apply'
import { migrateAtLayerUtilities } from './codemods/migrate-at-layer-utilities'
import { migrateMediaScreen } from './codemods/migrate-media-screen'
import { migrateMissingLayers } from './codemods/migrate-missing-layers'
import { migrateTailwindDirectives } from './codemods/migrate-tailwind-directives'
import { Stylesheet } from './stylesheet'

export interface MigrateOptions {
  newPrefix: string | null
  designSystem: DesignSystem
  userConfig: Config
}

export async function migrateContents(
  stylesheet: Stylesheet | string,
  options: MigrateOptions,
  file?: string,
) {
  if (typeof stylesheet === 'string') {
    stylesheet = await Stylesheet.fromString(stylesheet)
    stylesheet.file = file ?? null
  }

  return postcss()
    .use(migrateAtApply(options))
    .use(migrateMediaScreen(options))
    .use(migrateAtLayerUtilities())
    .use(migrateMissingLayers())
    .use(migrateTailwindDirectives(options))
    .process(stylesheet.root, { from: stylesheet.file ?? undefined })
}

export async function migrate(stylesheet: Stylesheet, options: MigrateOptions) {
  if (!stylesheet.file) {
    throw new Error('Cannot migrate a stylesheet without a file path')
  }

  await migrateContents(stylesheet, options)
}
