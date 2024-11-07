import type { Config } from 'tailwindcss'
import type { DesignSystem } from '../../../tailwindcss/src/design-system'
import { arbitraryValueToBareValue } from './codemods/arbitrary-value-to-bare-value'
import { automaticVarInjection } from './codemods/automatic-var-injection'
import { bgGradient } from './codemods/bg-gradient'
import { important } from './codemods/important'
import { maxWidthScreen } from './codemods/max-width-screen'
import { prefix } from './codemods/prefix'
import { simpleLegacyClasses } from './codemods/simple-legacy-classes'
import { themeToVar } from './codemods/theme-to-var'
import { variantOrder } from './codemods/variant-order'
import { spliceChangesIntoString, type StringChange } from './splice-changes-into-string'

export type Migration = (
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
  location?: {
    contents: string
    start: number
    end: number
  },
) => string

export const DEFAULT_MIGRATIONS: Migration[] = [
  prefix,
  important,
  automaticVarInjection,
  bgGradient,
  simpleLegacyClasses,
  arbitraryValueToBareValue,
  maxWidthScreen,
  themeToVar,
  variantOrder,
]

export function migrateCandidate(
  designSystem: DesignSystem,
  userConfig: Config,
  rawCandidate: string,
  // Location is only set when migrating a candidate from a source file
  location?: {
    contents: string
    start: number
    end: number
  },
): string {
  for (let migration of DEFAULT_MIGRATIONS) {
    rawCandidate = migration(designSystem, userConfig, rawCandidate, location)
  }
  return rawCandidate
}

export async function migrateContents(
  candidates: { rawCandidate: string; start: number; end: number }[],
  designSystem: DesignSystem,
  userConfig: Config,
  contents: string,
): Promise<string> {
  let changes: StringChange[] = []

  for (let { rawCandidate, start, end } of candidates) {
    let migratedCandidate = migrateCandidate(designSystem, userConfig, rawCandidate, {
      contents,
      start,
      end,
    })

    if (migratedCandidate === rawCandidate) {
      continue
    }

    changes.push({
      start,
      end,
      replacement: migratedCandidate,
    })
  }

  return spliceChangesIntoString(contents, changes)
}
