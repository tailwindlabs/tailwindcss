import { escape } from './utils/escape'

export const enum ThemeOptions {
  NONE = 0,
  INLINE = 1 << 0,
  REFERENCE = 1 << 1,
  DEFAULT = 1 << 2,
}

export class Theme {
  constructor(private values = new Map<string, { value: string; options: number }>()) {}

  add(key: string, value: string, options = ThemeOptions.NONE): void {
    if (key.endsWith('-*')) {
      if (value !== 'initial') {
        throw new Error(`Invalid theme value \`${value}\` for namespace \`${key}\``)
      }
      if (key === '--*') {
        this.values.clear()
      } else {
        this.#clearNamespace(key.slice(0, -2))
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

  keysInNamespaces(themeKeys: ThemeKey[]): string[] {
    let keys: string[] = []

    for (let prefix of themeKeys) {
      let namespace = `${prefix}-`

      for (let key of this.values.keys()) {
        if (key.startsWith(namespace)) {
          if (key.indexOf('--', 2) !== -1) {
            continue
          }

          keys.push(key.slice(namespace.length))
        }
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
    return this.values.entries()
  }

  #clearNamespace(namespace: string) {
    for (let key of this.values.keys()) {
      if (key.startsWith(namespace)) {
        this.values.delete(key)
      }
    }
  }

  #resolveKey(candidateValue: string | null, themeKeys: ThemeKey[]): string | null {
    for (let key of themeKeys) {
      let themeKey =
        candidateValue !== null ? escape(`${key}-${candidateValue.replaceAll('.', '_')}`) : key

      if (this.values.has(themeKey)) {
        return themeKey
      }
    }

    return null
  }

  #var(themeKey: string) {
    if (!this.values.has(themeKey)) {
      return null
    }

    return `var(${themeKey}, ${this.values.get(themeKey)?.value})`
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
}

export type ThemeKey = `--${string}`
