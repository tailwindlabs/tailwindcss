import { describe, expect, test } from 'vitest'
import { buildDesignSystem } from '../../design-system'
import { Theme } from '../../theme'
import { createCompatConfig, spreadTheme } from './create-compat-config'
import { resolveConfig } from './resolve-config'

describe('spreadTheme', () => {
  test('spreading a plain string produces garbage', () => {
    // When theme() returns a plain string `'1rem'`, a naive spread such as
    // `({ theme }) => ({ ...theme('text', {}) })` spreads the characters of
    // the string rather than producing `{ DEFAULT: '1rem' }`.
    let result = { ...('1rem' as any) }
    expect(result).not.toEqual({ DEFAULT: '1rem' })
    expect(result).toEqual({ '0': '1', '1': 'r', '2': 'e', '3': 'm' })
  })

  test('a naive extend entry without spreadTheme corrupts the config', () => {
    // Simulate what happens if someone adds an extend entry like:
    //
    //   fontSize: ({ theme }) => ({ ...theme('text', {}) })
    //
    // When the CSS theme only defines `--text` (a single DEFAULT value),
    // theme('text', {}) returns `'1rem'`, and `{ ...'1rem' }` becomes
    // `{ '0': '1', '1': 'r', '2': 'e', '3': 'm' }`.
    let theme = new Theme()
    theme.add('--text', '1rem')
    let design = buildDesignSystem(theme)

    // A config with a *naive* extend entry that doesn't use spreadTheme
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

    // The result is corrupted — string characters spread as indices
    expect(resolvedConfig.theme?.fontSize).not.toHaveProperty('DEFAULT')
    expect(resolvedConfig.theme?.fontSize).toEqual({ '0': '1', '1': 'r', '2': 'e', '3': 'm' })
  })

  test('spreadTheme prevents the corruption', () => {
    let theme = new Theme()
    theme.add('--text', '1rem')
    let design = buildDesignSystem(theme)

    let { resolvedConfig } = resolveConfig(design, [
      {
        config: {
          theme: {
            extend: {
              fontSize: ({ theme }: any) => spreadTheme(theme, 'text'),
            },
          },
        },
        base: '/root',
        reference: true,
        src: undefined,
      },
    ])

    expect(resolvedConfig.theme?.fontSize).toEqual({ DEFAULT: '1rem' })
  })

  test('wraps a string value in { DEFAULT: ... }', () => {
    let theme = (path: string, opts: any) => '3rem'
    expect(spreadTheme(theme, 'text')).toEqual({ DEFAULT: '3rem' })
  })

  test('spreads an object value', () => {
    let theme = (path: string, opts: any) => ({
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
    })
    expect(spreadTheme(theme, 'text')).toEqual({
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
    })
  })

  test('returns an empty object when theme returns a non-object like null', () => {
    let theme = (path: string, opts: any) => null
    expect(spreadTheme(theme, 'missing')).toEqual({})
  })

  test('returns an empty object when theme returns a non-object like undefined', () => {
    let theme = (path: string, opts: any) => undefined
    expect(spreadTheme(theme, 'missing')).toEqual({})
  })

  test('returns an empty object when theme returns an array', () => {
    let theme = (path: string, opts: any) => ['a', 'b']
    expect(spreadTheme(theme, 'list')).toEqual({})
  })

  test('returns a copy, not the original reference', () => {
    let original = { sm: '1rem' }
    let theme = (path: string, opts: any) => original
    let result = spreadTheme(theme, 'test')
    expect(result).toEqual(original)
    expect(result).not.toBe(original)
  })
})

describe('createCompatConfig — namespace mappings via spreadTheme', () => {
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

  test('fontSize DEFAULT is preserved when text is a single string', () => {
    let theme = new Theme()
    theme.add('--text', '1rem')
    let design = buildDesignSystem(theme)

    let { resolvedConfig } = resolveConfig(design, [
      { config: createCompatConfig(design.theme), base: '/root', reference: true, src: undefined },
    ])
    expect(resolvedConfig.theme?.fontSize?.DEFAULT).toBe('1rem')
  })

  test('maxWidth maps from the container namespace in the default theme', () => {
    let config = buildCompatConfig({})
    // The default theme has container.sm = '24rem'
    expect(config.theme?.maxWidth?.sm).toBe('24rem')
  })

  test('transitionDuration gets DEFAULT from --default-transition-duration', () => {
    let theme = new Theme()
    theme.add('--default-transition-duration', '150ms')
    let design = buildDesignSystem(theme)

    let { resolvedConfig } = resolveConfig(design, [
      { config: createCompatConfig(design.theme), base: '/root', reference: true, src: undefined },
    ])
    expect(resolvedConfig.theme?.transitionDuration?.DEFAULT).toBe('150ms')
  })

  test('transitionTimingFunction gets DEFAULT from --default-transition-timing-function', () => {
    let theme = new Theme()
    theme.add('--default-transition-timing-function', 'cubic-bezier(0.4, 0, 0.2, 1)')
    let design = buildDesignSystem(theme)

    let { resolvedConfig } = resolveConfig(design, [
      { config: createCompatConfig(design.theme), base: '/root', reference: true, src: undefined },
    ])
    expect(resolvedConfig.theme?.transitionTimingFunction?.DEFAULT).toBe(
      'cubic-bezier(0.4, 0, 0.2, 1)',
    )
  })
})
