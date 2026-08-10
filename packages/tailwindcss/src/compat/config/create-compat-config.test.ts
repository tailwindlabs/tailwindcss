import { describe, expect, test } from 'vitest'
import { buildDesignSystem } from '../../design-system'
import { Theme } from '../../theme'
import { createCompatConfig } from './create-compat-config'
import { resolveConfig } from './resolve-config'

function buildCompatConfig(cssValues: Record<string, string>) {
  let theme = new Theme()
  for (let [key, value] of Object.entries(cssValues)) {
    theme.add(key, value)
  }
  let design = buildDesignSystem(theme)

  let { resolvedConfig } = resolveConfig(design, [
    { config: createCompatConfig(design.theme), base: '/root', reference: true, src: undefined },
  ])

  return resolvedConfig
}

describe('theme namespace lookups', () => {
  test('a namespace that only defines a bare value resolves to `{ DEFAULT: … }`, not a string', () => {
    // When the CSS theme only defines `--text` (a single bare value),
    // `theme('text', {})` used to return the string `'1rem'`.
    //
    // Spreading that string, like the compat config does, produced char-indexed
    // garbage (`{ '0': '1', '1': 'r', … }`) instead of `{ DEFAULT: '1rem' }`.
    let config = buildCompatConfig({ '--text': '1rem' })

    expect(config.theme?.fontSize?.DEFAULT).toBe('1rem')
    expect(config.theme?.fontSize).not.toHaveProperty('0')
  })

  test('a bare value is kept alongside suffixed values in the same namespace', () => {
    let config = buildCompatConfig({
      '--text': '1rem',
      '--text-sm': '0.875rem',
    })

    expect(config.theme?.fontSize?.DEFAULT).toBe('1rem')
    expect(config.theme?.fontSize?.sm).toBe('0.875rem')
  })

  test('a naive spread of a theme namespace in a user config is safe', () => {
    let theme = new Theme()
    theme.add('--text', '1rem')
    let design = buildDesignSystem(theme)

    let { resolvedConfig } = resolveConfig(design, [
      {
        config: {
          theme: {
            extend: {
              fontSize: ({ theme }: any) => ({ ...theme('text', {}) }),
            },
          },
        },
        base: '/root',
        reference: true,
        src: undefined,
      },
    ])

    expect(resolvedConfig.theme?.fontSize?.DEFAULT).toBe('1rem')
    expect(resolvedConfig.theme?.fontSize).not.toHaveProperty('0')
  })

  test('namespace root lookups resolve to an object, key lookups resolve to the value', () => {
    let theme = new Theme()
    theme.add('--text', '1rem')
    theme.add('--animate-spin', 'spin 1s linear infinite')
    let design = buildDesignSystem(theme)

    let root: unknown
    let rootWithDefault: unknown
    let leaf: unknown

    resolveConfig(design, [
      {
        config: {
          theme: {
            extend: {
              fontSize: ({ theme }: any) => {
                root = theme('text')
                rootWithDefault = theme('text', {})
                leaf = theme('animate.spin')
                return {}
              },
            },
          },
        },
        base: '/root',
        reference: true,
        src: undefined,
      },
    ])

    // A namespace root lookup always resolves to an object, like in v3, even
    // when the namespace only contains a bare value
    expect(root).toMatchObject({ DEFAULT: '1rem' })
    expect(rootWithDefault).toMatchObject({ DEFAULT: '1rem' })

    // Lookups of a specific key resolve to the value itself
    expect(leaf).toBe('spin 1s linear infinite')
  })

  test('lookups of a specific key still resolve to the value itself', () => {
    let theme = new Theme()
    theme.add('--animate-spin', 'spin 1s linear infinite')
    let design = buildDesignSystem(theme)

    let { resolvedConfig } = resolveConfig(design, [
      {
        config: {
          theme: {
            extend: {
              animation: ({ theme }: any) => ({ spin: theme('animate.spin') }),
            },
          },
        },
        base: '/root',
        reference: true,
        src: undefined,
      },
    ])

    expect(resolvedConfig.theme?.animation?.spin).toBe('spin 1s linear infinite')
  })
})

describe('createCompatConfig namespace mappings', () => {
  test('fontSize maps from CSS text namespace', () => {
    let config = buildCompatConfig({ '--text-base': '1rem' })
    expect(config.theme?.fontSize?.base).toBe('1rem')
  })

  test('boxShadow maps from CSS shadow namespace', () => {
    let config = buildCompatConfig({ '--shadow-md': '0 4px 6px #000' })
    expect(config.theme?.boxShadow?.md).toBe('0 4px 6px #000')
  })

  test('animation maps from CSS animate namespace', () => {
    let config = buildCompatConfig({ '--animate-spin': 'spin 1s linear infinite' })
    expect(config.theme?.animation?.spin).toBe('spin 1s linear infinite')
  })

  test('aspectRatio maps from CSS aspect namespace', () => {
    let config = buildCompatConfig({ '--aspect-square': '1 / 1' })
    expect(config.theme?.aspectRatio?.square).toBe('1 / 1')
  })

  test('borderRadius maps from CSS radius namespace', () => {
    let config = buildCompatConfig({ '--radius-lg': '0.5rem' })
    expect(config.theme?.borderRadius?.lg).toBe('0.5rem')
  })

  test('screens maps from CSS breakpoint namespace', () => {
    let config = buildCompatConfig({ '--breakpoint-sm': '640px' })
    expect(config.theme?.screens?.sm).toBe('640px')
  })

  test('letterSpacing maps from CSS tracking namespace', () => {
    let config = buildCompatConfig({ '--tracking-wide': '0.025em' })
    expect(config.theme?.letterSpacing?.wide).toBe('0.025em')
  })

  test('lineHeight maps from CSS leading namespace', () => {
    let config = buildCompatConfig({ '--leading-relaxed': '1.75' })
    expect(config.theme?.lineHeight?.relaxed).toBe('1.75')
  })

  test('maxWidth maps from the container namespace in the default theme', () => {
    let config = buildCompatConfig({})
    // The default theme has container.sm = '24rem'
    expect(config.theme?.maxWidth?.sm).toBe('24rem')
  })

  test('transitionDuration gets DEFAULT from --default-transition-duration', () => {
    let config = buildCompatConfig({ '--default-transition-duration': '150ms' })
    expect(config.theme?.transitionDuration?.DEFAULT).toBe('150ms')
  })

  test('transitionTimingFunction gets DEFAULT from --default-transition-timing-function', () => {
    let config = buildCompatConfig({
      '--default-transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
    })
    expect(config.theme?.transitionTimingFunction?.DEFAULT).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
  })
})
