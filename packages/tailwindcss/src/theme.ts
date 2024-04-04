import { escape } from './utils/escape'

export class Theme {
  constructor(private values = new Map<string, { value: string; isReference: boolean }>()) {}

  add(key: string, value: string, isReference = false): void {
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

    if (value === 'initial') {
      this.values.delete(key)
    } else {
      this.values.set(key, { value, isReference })
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

  get(themeKeys: (ThemeKey | `${ThemeKey}-${string}`)[]): string | null {
    for (let key of themeKeys) {
      let value = this.values.get(key)
      if (value) {
        return value.value
      }
    }

    return null
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

  #resolveKey(candidateValue: string, themeKeys: ThemeKey[]): string | null {
    for (let key of themeKeys) {
      let themeKey = escape(`${key}-${candidateValue.replaceAll('.', '_')}`)

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

  resolve(candidateValue: string, themeKeys: ThemeKey[]): string | null {
    let themeKey = this.#resolveKey(candidateValue, themeKeys)

    if (!themeKey) return null

    return this.#var(themeKey)
  }

  resolveValue(candidateValue: string, themeKeys: ThemeKey[]): string | null {
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
      let nestedValue = this.#var(`${themeKey}${name}`)
      if (nestedValue) {
        extra[name] = nestedValue
      }
    }

    return [this.#var(themeKey)!, extra]
  }

  namespace(namespace: string) {
    let values = new Map<string | null, string>()
    let prefix = `${namespace}-`

    for (let [key, value] of this.values) {
      if (key === namespace) {
        values.set(null, value.value)
      } else if (key.startsWith(prefix)) {
        values.set(key.slice(prefix.length), value.value)
      }
    }

    return values
  }
}

export type ThemeKey =
  | '--accent-color'
  | '--animate'
  | '--aspect-ratio'
  | '--backdrop-blur'
  | '--backdrop-brightness'
  | '--backdrop-contrast'
  | '--backdrop-grayscale'
  | '--backdrop-hue-rotate'
  | '--backdrop-invert'
  | '--backdrop-opacity'
  | '--backdrop-saturate'
  | '--backdrop-sepia'
  | '--background-color'
  | '--background-image'
  | '--blur'
  | '--border-color'
  | '--border-spacing'
  | '--border-width'
  | '--box-shadow-color'
  | '--breakpoint'
  | '--brightness'
  | '--caret-color'
  | '--color'
  | '--columns'
  | '--contrast'
  | '--cursor'
  | '--default-border-width'
  | '--default-ring-color'
  | '--default-ring-width'
  | '--default-transition-timing-function'
  | '--default-transition-duration'
  | '--divide-width'
  | '--divide-color'
  | '--drop-shadow'
  | '--fill'
  | '--flex-basis'
  | '--font-family'
  | '--font-size'
  | '--font-weight'
  | '--gap'
  | '--gradient-color-stop-positions'
  | '--grayscale'
  | '--grid-auto-columns'
  | '--grid-auto-rows'
  | '--grid-column'
  | '--grid-column-end'
  | '--grid-column-start'
  | '--grid-row'
  | '--grid-row-end'
  | '--grid-row-start'
  | '--grid-template-columns'
  | '--grid-template-rows'
  | '--height'
  | '--hue-rotate'
  | '--inset'
  | '--inset-shadow'
  | '--invert'
  | '--letter-spacing'
  | '--line-height'
  | '--line-clamp'
  | '--list-style-image'
  | '--list-style-type'
  | '--margin'
  | '--max-height'
  | '--max-width'
  | '--min-height'
  | '--min-width'
  | '--object-position'
  | '--opacity'
  | '--order'
  | '--outline-color'
  | '--outline-width'
  | '--outline-offset'
  | '--padding'
  | '--placeholder-color'
  | '--perspective'
  | '--perspective-origin'
  | '--radius'
  | '--ring-color'
  | '--ring-offset-color'
  | '--ring-offset-width'
  | '--ring-width'
  | '--rotate'
  | '--saturate'
  | '--scale'
  | '--scroll-margin'
  | '--scroll-padding'
  | '--sepia'
  | '--shadow'
  | '--size'
  | '--skew'
  | '--space'
  | '--spacing'
  | '--stroke'
  | '--stroke-width'
  | '--text-color'
  | '--text-decoration-color'
  | '--text-decoration-thickness'
  | '--text-indent'
  | '--text-underline-offset'
  | '--transform-origin'
  | '--transition-delay'
  | '--transition-duration'
  | '--transition-property'
  | '--transition-timing-function'
  | '--translate'
  | '--width'
  | '--z-index'

export type ColorThemeKey =
  | '--color'
  | '--accent-color'
  | '--background-color'
  | '--border-color'
  | '--box-shadow-color'
  | '--caret-color'
  | '--divide-color'
  | '--fill'
  | '--outline-color'
  | '--placeholder-color'
  | '--ring-color'
  | '--ring-offset-color'
  | '--stroke'
  | '--text-color'
  | '--text-decoration-color'
