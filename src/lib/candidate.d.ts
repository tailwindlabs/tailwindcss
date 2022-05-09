type Arbitrary = {
  raw: string
  value: string
  dataType: AnyStringWithAutocomplete<DataType>
}

type VariantCommon = { raw: string }
type VariantType =
  | { type: 'constrained'; name: string }
  | { type: 'partial'; name: string; value: string; dataType: DataType }
  | { type: 'custom'; value: string; dataType: DataType }

type Variant = VariantCommon & VariantType

type ModifierCommon = { raw: string }
type ModifierType = { value: string | Arbitrary }

type Modifier = ModifierCommon & ModifierType

type UtilityCommon = {
  raw: string
  className: string
  withoutVariants: string // TODO: remove this
  important: boolean
  prefix: string
  negative: boolean

  variants: Variant[]
}

export type Plugin = {
  plugin: string
  value: string | Arbitrary
  modifiers: Modifier[]
}

type UtilityType =
  | {
      type: 'constrained'
      plugins: Plugin[]
    }
  | { type: 'custom'; name: string; value: string; modifiers: Modifier[] }

export type Candidate<T = UtilityType['type']> = UtilityCommon & Extract<UtilityType, { type: T }>

export function parseCandidate(raw: string, context: any): Candidate | null

export type AnyStringWithAutocomplete<T> = T | (string & Record<never, never>)

export type DataType =
  | 'any'
  | 'color'
  | 'url'
  | 'image'
  | 'length'
  | 'percentage'
  | 'position'
  | 'lookup'
  | 'generic-name'
  | 'family-name'
  | 'number'
  | 'line-width'
  | 'absolute-size'
  | 'relative-size'
  | 'shadow'
