import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { expect, test, vi } from 'vitest'
import type { UserConfig } from '../../../../tailwindcss/src/compat/config/types'
import type { DesignSystem } from '../../../../tailwindcss/src/design-system'
import * as versions from '../../utils/version'
import { migrateArbitraryVariants } from './migrate-arbitrary-variants'
import { migrateEmptyArbitraryValues } from './migrate-handle-empty-arbitrary-values'
import { migrateModernizeArbitraryValues } from './migrate-modernize-arbitrary-values'
import { migratePrefix } from './migrate-prefix'
vi.spyOn(versions, 'isMajor').mockReturnValue(true)

const css = String.raw

function migrate(designSystem: DesignSystem, userConfig: UserConfig | null, rawCandidate: string) {
  for (let migration of [
    migrateEmptyArbitraryValues,
    migratePrefix,
    migrateModernizeArbitraryValues,
    migrateArbitraryVariants,
    (designSystem: DesignSystem, _: UserConfig | null, rawCandidate: string) => {
      return designSystem.canonicalizeCandidates([rawCandidate]).pop() ?? rawCandidate
    },
  ]) {
    rawCandidate = migration(designSystem, userConfig, rawCandidate)
  }
  return rawCandidate
}

test.each([
  // Some extreme examples of what happens in the wild:
  ['group-[]:flex', 'in-[.group]:flex'],
  ['group-[]/name:flex', 'in-[.group\\/name]:flex'],

  // Migrate `peer-[]` to a parsable `peer-[&]` instead:
  ['peer-[]:flex', 'peer-[&]:flex'],
  ['peer-[]/name:flex', 'peer-[&]/name:flex'],

  // These shouldn't happen in the real world (because compound variants are
  // new). But this could happen once we allow codemods to run in v4+ projects.
  ['has-group-[]:flex', 'has-in-[.group]:flex'],
  ['has-group-[]/name:flex', 'has-in-[.group\\/name]:flex'],
  ['not-group-[]:flex', 'not-in-[.group]:flex'],
  ['not-group-[]/name:flex', 'not-in-[.group\\/name]:flex'],
])('%s => %s (%#)', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';
      @theme {
        --*: initial;
      }
    `,
    { base: __dirname },
  )

  expect(migrate(designSystem, {}, candidate)).toEqual(result)
})

test.each([
  // Should not prefix classes in arbitrary values
  ['[.foo_&]:tw-flex', 'tw:in-[.foo]:flex'],

  // Should migrate `.group` classes
  ['group-[]:tw-flex', 'tw:in-[.tw\\:group]:flex'],
  ['group-[]/name:tw-flex', 'tw:in-[.tw\\:group\\/name]:flex'],

  // Migrate `peer-[]` to a parsable `peer-[&]` instead:
  ['peer-[]:tw-flex', 'tw:peer-[&]:flex'],
  ['peer-[]/name:tw-flex', 'tw:peer-[&]/name:flex'],

  // However, `.group` inside of an arbitrary variant should not be prefixed:
  ['[.group_&]:tw-flex', 'tw:in-[.group]:flex'],

  // These shouldn't happen in the real world (because compound variants are
  // new). But this could happen once we allow codemods to run in v4+ projects.
  ['has-group-[]:tw-flex', 'tw:has-in-[.tw\\:group]:flex'],
  ['has-group-[]/name:tw-flex', 'tw:has-in-[.tw\\:group\\/name]:flex'],
  ['not-group-[]:tw-flex', 'tw:not-in-[.tw\\:group]:flex'],
  ['not-group-[]/name:tw-flex', 'tw:not-in-[.tw\\:group\\/name]:flex'],
])('%s => %s (%#)', async (candidate, result) => {
  let designSystem = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss' prefix(tw);
      @theme {
        --*: initial;
      }
    `,
    { base: __dirname },
  )

  expect(migrate(designSystem, { prefix: 'tw-' }, candidate)).toEqual(result)
})
