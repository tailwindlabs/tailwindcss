import parse from 'mri'

// Definition of the arguments for a command in the CLI.
export type Arg = {
  [key: `--${string}`]: {
    type: keyof Types
    description: string
    alias?: `-${string}`
    default?: Types[keyof Types]
  }
}

// Each argument will have a type and we want to convert the incoming raw string
// based value to the correct type. We can't use pure TypeScript types because
// these don't exist at runtime. Instead, we define a string-based type that
// maps to a TypeScript type.
type Types = {
  boolean: boolean
  number: number | null
  string: string | null
  'boolean | string': boolean | string | null
  'number | string': number | string | null
  'boolean | number': boolean | number | null
  'boolean | number | string': boolean | number | string | null
}

// Convert the `Arg` type to a type that can be used at runtime.
//
// E.g.:
//
// Arg:
// ```
// { '--input': { type: 'string', description: 'Input file', alias: '-i' } }
// ```
//
// Command:
// ```
// ./tailwindcss -i input.css
// ./tailwindcss --input input.css
// ```
//
// Result type:
// ```
// {
//   _: string[],             // All non-flag arguments
//   '--input': string | null // The `--input` flag will be filled with `null`, if the flag is not used.
//                            // The `null` type will not be there if `default` is provided.
// }
// ```
//
// Result runtime object:
// ```
// {
//   _: [],
//   '--input': 'input.css'
// }
// ```
export type Result<T extends Arg> = {
  [K in keyof T]: T[K] extends { type: keyof Types; default?: any }
    ? undefined extends T[K]['default']
      ? Types[T[K]['type']]
      : NonNullable<Types[T[K]['type']]>
    : never
} & {
  // All non-flag arguments
  _: string[]
}

export function args<const T extends Arg>(options: T, argv = process.argv.slice(2)): Result<T> {
  for (let [idx, value] of argv.entries()) {
    if (value === '-') {
      argv[idx] = '__IO_DEFAULT_VALUE__'
    }
  }

  let parsed = parse(argv)

  for (let key in parsed) {
    if (parsed[key] === '__IO_DEFAULT_VALUE__') {
      parsed[key] = '-'
    }
  }

  let result: { _: string[]; [key: string]: unknown } = {
    _: parsed._,
  }

  for (let [
    flag,
    { type, alias, default: defaultValue = type === 'boolean' ? false : null },
  ] of Object.entries(options)) {
    // Start with the default value
    result[flag] = defaultValue

    // Try to find the `alias`, and map it to long form `flag`
    if (alias) {
      let key = alias.slice(1)
      if (parsed[key] !== undefined) {
        result[flag] = convert(parsed[key], type)
      }
    }

    // Try to find the long form `flag`
    {
      let key = flag.slice(2)
      if (parsed[key] !== undefined) {
        result[flag] = convert(parsed[key], type)
      }
    }
  }

  return result as Result<T>
}

// ---

type ArgumentType = string | boolean

// Try to convert the raw incoming `value` (which will be a string or a boolean,
// this is coming from `mri`'s parse function'), to the correct type based on
// the `type` of the argument.
function convert<T extends keyof Types>(value: string | boolean, type: T) {
  switch (type) {
    case 'string':
      return convertString(value)
    case 'boolean':
      return convertBoolean(value)
    case 'number':
      return convertNumber(value)
    case 'boolean | string':
      return convertBoolean(value) ?? convertString(value)
    case 'number | string':
      return convertNumber(value) ?? convertString(value)
    case 'boolean | number':
      return convertBoolean(value) ?? convertNumber(value)
    case 'boolean | number | string':
      return convertBoolean(value) ?? convertNumber(value) ?? convertString(value)
    default:
      throw new Error(`Unhandled type: ${type}`)
  }
}

function convertBoolean(value: ArgumentType) {
  if (value === true || value === false) {
    return value
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }
}

function convertNumber(value: ArgumentType) {
  if (typeof value === 'number') {
    return value
  }

  {
    let valueAsNumber = Number(value)
    if (!Number.isNaN(valueAsNumber)) {
      return valueAsNumber
    }
  }
}

function convertString(value: ArgumentType) {
  return `${value}`
}
