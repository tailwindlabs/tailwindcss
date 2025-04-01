import postcss from 'postcss'
import type { Config } from '../../../../tailwindcss/src/compat/plugin-api'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import { Stylesheet } from '../../stylesheet'
import type { JSConfigMigration } from '../config/migrate-js-config'
import { migrateAtApply } from './migrate-at-apply'
import { migrateAtLayerUtilities } from './migrate-at-layer-utilities'
import { migrateConfig } from './migrate-config'
import { migrateImport } from './migrate-import'
import { migrateMediaScreen } from './migrate-media-screen'
import { migrateMissingLayers } from './migrate-missing-layers'
import { migratePreflight } from './migrate-preflight'
import { migrateTailwindDirectives } from './migrate-tailwind-directives'
import { migrateThemeToVar } from './migrate-theme-to-var'
import { migrateVariantsDirective } from './migrate-variants-directive'

export interface MigrateOptions {
  newPrefix: string | null
  designSystem: DesignSystem
  userConfig: Config
  configFilePath: string
  jsConfigMigration: JSConfigMigration
}

export async function migrate(stylesheet: Stylesheet, options: MigrateOptions) {
  if (!stylesheet.file) {
    throw new Error('Cannot migrate a stylesheet without a file path')
  }

  if (!stylesheet.canMigrate) return

  await migrateContents(stylesheet, options)
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
    .use(migrateImport())
    .use(migrateAtApply(options))
    .use(migrateMediaScreen(options))
    .use(migrateVariantsDirective())
    .use(migrateAtLayerUtilities(stylesheet))
    .use(migrateMissingLayers())
    .use(migrateTailwindDirectives(options))
    .use(migrateConfig(stylesheet, options))
    .use(migratePreflight(options))
    .use(migrateThemeToVar(options))
    .process(stylesheet.root, { from: stylesheet.file ?? undefined })
}
