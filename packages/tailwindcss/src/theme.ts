import { walk, WalkAction, type AstNode, type AtRule } from './ast'
import { escape } from './utils/escape'
import * as ValueParser from './value-parser'

export const enum ThemeOptions {
  NONE = 0,
  INLINE = 1 << 0,
  REFERENCE = 1 << 1,
  DEFAULT = 1 << 2,
  USED = 1 << 3,
}

// In the future we may want to replace this with just a `Set` of known theme
// keys and let the computer sort out which keys should ignored which other keys
// based on overlapping prefixes.
const ignoredThemeKeyMap = new Map([
  ['--font', ['--font-weight', '--font-size']],
  ['--inset', ['--inset-shadow', '--inset-ring']],
  [
    '--text',
    [
      '--text-color',
      '--text-underline-offset',
      '--text-indent',
      '--text-decoration-thickness',
      '--text-decoration-color',
    ],
  ],
])

function isIgnoredThemeKey(themeKey: ThemeKey, namespace: ThemeKey) {
  return (ignoredThemeKeyMap.get(namespace) ?? []).some(
    (ignoredThemeKey) => themeKey === ignoredThemeKey || themeKey.startsWith(`${ignoredThemeKey}-`),
  )
}

export class Theme {
  public prefix: string | null = null

  constructor(
    private values = new Map<string, { value: string; options: ThemeOptions }>(),
    private keyframes = new Set<AtRule>([]),
  ) {}

  add(key: string, value: string, options = ThemeOptions.NONE): void {
    if (key.endsWith('-*')) {
      if (value !== 'initial') {
        throw new Error(`Invalid theme value \`${value}\` for namespace \`${key}\``)
      }
      if (key === '--*') {
        this.values.clear()
      } else {
        this.clearNamespace(
          key.slice(0, -2),
          // `--${key}-*: initial;` should clear _all_ theme values
          ThemeOptions.NONE,
        )
      }
    }

    if (options & ThemeOptions.DEFAULT) {
      let existing = this.values.get(key)
      if (existing && !(existing.options & ThemeOptions.DEFAULT)) return
    }

    if (value === 'initial') {
      this.values.delete(key)
    } else {
      this.values.set(key, { value, options })
    }
  }

  keysInNamespaces(themeKeys: Iterable<ThemeKey>): string[] {
    let keys: string[] = []

    for (let namespace of themeKeys) {
      let prefix = `${namespace}-`

      for (let key of this.values.keys()) {
        if (!key.startsWith(prefix)) continue

        if (key.indexOf('--', 2) !== -1) continue

        if (isIgnoredThemeKey(key as ThemeKey, namespace)) {
          continue
        }

        keys.push(key.slice(prefix.length))
      }
    }

    return keys
  }

  get(themeKeys: ThemeKey[]): string | null {
    for (let key of themeKeys) {
      let value = this.values.get(key)
      if (value) {
        return value.value
      }
    }

    return null
  }

  hasDefault(key: string): boolean {
    return (this.getOptions(key) & ThemeOptions.DEFAULT) === ThemeOptions.DEFAULT
  }

  getOptions(key: string) {
    return this.values.get(key)?.options ?? ThemeOptions.NONE
  }

  entries() {
    if (!this.prefix) return this.values.entries()

    return Array.from(this.values, (entry) => {
      entry[0] = this.#prefixKey(entry[0])
      return entry
    })
  }

  #prefixKey(key: string) {
    if (!this.prefix) return key
    return `--${this.prefix}-${key.slice(2)}`
  }

  clearNamespace(namespace: string, clearOptions: ThemeOptions) {
    let ignored = ignoredThemeKeyMap.get(namespace) ?? []

    outer: for (let key of this.values.keys()) {
      if (key.startsWith(namespace)) {
        if (clearOptions !== ThemeOptions.NONE) {
          let options = this.getOptions(key)
          if ((options & clearOptions) !== clearOptions) {
            continue
          }
        }
        for (let ignoredNamespace of ignored) {
          if (key.startsWith(ignoredNamespace)) continue outer
        }
        this.values.delete(key)
      }
    }
  }

  #resolveKey(candidateValue: string | null, themeKeys: ThemeKey[]): string | null {
    for (let namespace of themeKeys) {
      let themeKey =
        candidateValue !== null ? (`${namespace}-${candidateValue}` as ThemeKey) : namespace

      if (!this.values.has(themeKey)) {
        // If the exact theme key is not found, we might be trying to resolve a key containing a dot
        // that was registered with an underscore instead:
        if (candidateValue !== null && candidateValue.includes('.')) {
          themeKey = `${namespace}-${candidateValue.replaceAll('.', '_')}` as ThemeKey

          if (!this.values.has(themeKey)) continue
        } else {
          continue
        }
      }

      if (isIgnoredThemeKey(themeKey, namespace)) continue

      return themeKey
    }

    return null
  }

  #var(themeKey: string) {
    if (!this.values.has(themeKey)) {
      return null
    }

    this.use(themeKey)

    return `var(${escape(this.#prefixKey(themeKey))})`
  }

  trackUsedVariables(ast: AstNode[]) {
    walk(ast, (node) => {
      // Variables used in `@utility` and `@custom-variant` at-rules will be
      // handled separately, because we only want to mark them as used if the
      // utility or variant is used.
      if (
        node.kind === 'at-rule' &&
        (node.name === '@utility' || node.name === '@custom-variant')
      ) {
        return WalkAction.Skip
      }

      if (node.kind !== 'declaration') return
      if (!node.value?.includes('var(')) return

      ValueParser.walk(ValueParser.parse(node.value), (node) => {
        if (node.kind !== 'function' || node.value !== 'var') return

        ValueParser.walk(node.nodes, (child) => {
          if (child.kind !== 'word' || child.value[0] !== '-' || child.value[1] !== '-') return

          this.use(child.value)
        })
      })
    })
  }

  use(themeKey: string) {
    let value = this.values.get(themeKey)
    if (!value) return

    value.options |= ThemeOptions.USED
  }

  resolve(candidateValue: string | null, themeKeys: ThemeKey[]): string | null {
    let themeKey = this.#resolveKey(candidateValue, themeKeys)

    if (!themeKey) return null

    let value = this.values.get(themeKey)!

    if (value.options & ThemeOptions.INLINE) {
      return value.value
    }

    return this.#var(themeKey)
  }

  resolveValue(candidateValue: string | null, themeKeys: ThemeKey[]): string | null {
    let themeKey = this.#resolveKey(candidateValue, themeKeys)

    if (!themeKey) return null

    return this.values.get(themeKey)!.value
  }

  resolveWith(
    candidateValue: string,
    themeKeys: ThemeKey[],
    nestedKeys: `--${string}`[] = [],
  ): [string, Record<string, string>] | null {
    let themeKey = this.#resolveKey(candidateValue, themeKeys)

    if (!themeKey) return null

    let extra = {} as Record<string, string>
    for (let name of nestedKeys) {
      let nestedKey = `${themeKey}${name}`
      let nestedValue = this.values.get(nestedKey)!
      if (!nestedValue) continue

      if (nestedValue.options & ThemeOptions.INLINE) {
        extra[name] = nestedValue.value
      } else {
        extra[name] = this.#var(nestedKey)!
      }
    }

    let value = this.values.get(themeKey)!

    if (value.options & ThemeOptions.INLINE) {
      return [value.value, extra]
    }

    return [this.#var(themeKey)!, extra]
  }

  namespace(namespace: string) {
    let values = new Map<string | null, string>()
    let prefix = `${namespace}-`

    for (let [key, value] of this.values) {
      if (key === namespace) {
        values.set(null, value.value)
      } else if (key.startsWith(`${prefix}-`)) {
        // Preserve `--` prefix for sub-variables
        // e.g. `--font-size-sm--line-height`
        values.set(key.slice(namespace.length), value.value)
      } else if (key.startsWith(prefix)) {
        values.set(key.slice(prefix.length), value.value)
      }
    }

    return values
  }

  addKeyframes(value: AtRule): void {
    this.keyframes.add(value)
  }

  getKeyframes() {
    return Array.from(this.keyframes)
  }
}

export type ThemeKey = `--${string}`
