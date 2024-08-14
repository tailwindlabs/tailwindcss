import { describe, expect, it, test } from 'vitest'
import { corePlugins } from '../generated/core-utils'
import { Resolver } from './resolve'
import type { ConfigurablePlugin, RawPlugin, UserConfig } from './types'

let corePluginsDisabled = Object.fromEntries(
  Object.entries(corePlugins).map(([name]) => [name, false]),
)

let resolver = new Resolver()

function stubs() {
  let list: Record<number, ConfigurablePlugin> = {}

  function stub(id: number, config: UserConfig = {}): ConfigurablePlugin {
    return (list[id] ??= {
      config: () => config,
      handler: Object.assign(() => {}, {
        get [Symbol.toStringTag]() {
          // The ID is for debugging
          return `stub ${id}`
        },
      }),
    })
  }

  Object.defineProperty(stub, 'all', {
    get() {
      return Object.values(list).map((list) => list.handler)
    },
  })

  return stub as typeof stub & {
    readonly all: RawPlugin[]
  }
}

describe('general', () => {
  it('resolves to a minimal config when passed nothing', async () => {
    let config = await resolver.resolve([])

    expect(config).toEqual({
      blocklist: [],
      content: {
        files: [],
        transform: {},
      },
      prefix: '',
      separator: ':',
      important: false,
      darkMode: 'media',
      plugins: [],
      theme: {},
      corePlugins,
    })
  })

  it('replaces top level properties', async () => {
    let config = await resolver.resolve([
      { prefix: '', important: false, separator: ':' },
      { prefix: 'tw-', important: true, separator: '_' },
    ])

    expect(config).toMatchObject({
      prefix: 'tw-',
      important: true,
      separator: '_',
    })
  })

  it('can resolve 3+ configs into one', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          fontFamily: {
            body: ['Arial', 'sans-serif'],
            display: ['Georgia', 'serif'],
          },
          colors: {
            blue: 'blue',
          },
          backgroundColor: ({ theme }) => theme('colors'),
        },
      },
      {
        theme: {
          extend: {
            fontFamily: {
              hero: ['Futura', 'sans-serif'],
            },
            colors: {
              pink: 'pink',
            },
            backgroundColor: () => ({
              customBackgroundThree: '#c0ffee',
            }),
            textDecorationColor: {
              lime: 'lime',
            },
          },
        },
      },
      {
        theme: {
          extend: {
            fontFamily: {
              quote: ['Helvetica', 'serif'],
            },
            colors: {
              green: 'green',
            },
            backgroundColor: {
              customBackgroundTwo: '#facade',
            },
            textDecorationColor: ({ theme }) => theme('colors'),
          },
        },
      },
      {
        theme: {
          extend: {
            fontFamily: () => ({
              code: ['Menlo', 'monospace'],
            }),
            colors: {
              red: 'red',
            },
            backgroundColor: {
              customBackgroundOne: '#bada55',
            },
            textDecorationColor: {
              orange: 'orange',
            },
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      fontFamily: {
        body: ['Arial', 'sans-serif'],
        display: ['Georgia', 'serif'],
        code: ['Menlo', 'monospace'],
        quote: ['Helvetica', 'serif'],
        hero: ['Futura', 'sans-serif'],
      },
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        pink: 'pink',
      },
      backgroundColor: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        pink: 'pink',
        customBackgroundOne: '#bada55',
        customBackgroundTwo: '#facade',
        customBackgroundThree: '#c0ffee',
      },
      textDecorationColor: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        pink: 'pink',
        orange: 'orange',
        lime: 'lime',
      },
    })
  })

  it('does not duplicate extended configs every time resolve is called', async () => {
    let shared = {
      foo: { bar: { baz: [{ color: 'red' }] } },
    }

    const createConfig = (color: string) =>
      resolver.resolve([
        {
          theme: {
            foo: shared.foo,
            extend: {
              foo: { bar: { baz: { color } } },
            },
          },
        },
      ])

    await createConfig('orange')
    await createConfig('yellow')
    await createConfig('green')

    let config = await createConfig('blue')

    expect(shared.foo.bar.baz).toMatchObject([{ color: 'red' }])

    // @ts-ignore
    expect(config.theme.foo.bar.baz).toMatchObject([{ color: 'red' }, { color: 'blue' }])
  })
})

describe('theme', () => {
  it('shallow merges themes across configs', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            'grey-darker': '#606f7b',
            'grey-dark': '#8795a1',
            grey: '#b8c2cc',
            'grey-light': '#dae1e7',
            'grey-lighter': '#f1f5f8',
          },
          fonts: {
            sans: ['system-ui', 'Roboto', 'sans-serif'],
            serif: ['Constantia', 'Lucida Bright', 'Georgia', 'serif'],
          },
          screens: {
            sm: '500px',
            md: '750px',
            lg: '1000px',
          },
        },
      },
      {
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        'grey-darker': '#606f7b',
        'grey-dark': '#8795a1',
        grey: '#b8c2cc',
        'grey-light': '#dae1e7',
        'grey-lighter': '#f1f5f8',
      },
      fonts: {
        sans: ['system-ui', 'Roboto', 'sans-serif'],
        serif: ['Constantia', 'Lucida Bright', 'Georgia', 'serif'],
      },
      screens: {
        mobile: '400px',
      },
    })
  })

  it('deeply merges theme extensions across configs', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            grey: {
              light: '#dae1e7',
            },
          },
        },
      },
      {
        theme: {
          extend: {
            colors: {
              grey: {
                dark: '#8795a1',
              },
            },
          },
        },
      },
    ])

    expect(config.theme).toEqual({
      colors: {
        grey: {
          dark: '#8795a1',
          light: '#dae1e7',
        },
      },
    })
  })

  it('lazily evaluates functions in themes (1)', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            cyan: 'cyan',
            magenta: 'magenta',
            yellow: 'yellow',
          },
          backgroundColors: ({ theme }) => theme('colors'),
          textColors: ({ theme }) => theme('colors'),
        },
      },
      {
        theme: {
          colors: {
            red: 'red',
            green: 'green',
            blue: 'blue',
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      textColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    })
  })

  it('lazily evaluates functions in themes (2)', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            cyan: 'cyan',
            magenta: 'magenta',
            yellow: 'yellow',
          },
          backgroundColors: ({ colors }) => colors,
          textColors: ({ colors }) => colors,
        },
      },
      {
        theme: {
          colors: {
            red: 'red',
            green: 'green',
            blue: 'blue',
          },
          backgroundColors: ({ theme }) => ({
            ...theme('colors'),
            customBackground: '#bada55',
          }),
          textColors: ({ theme }) => ({
            ...theme('colors'),
            customText: '#facade',
          }),
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        customBackground: '#bada55',
      },
      textColors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
        customText: '#facade',
      },
    })
  })

  it('theme values in the extend section extend the existing theme', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            cyan: 'cyan',
            magenta: 'magenta',
            yellow: 'yellow',
          },
          opacity: {
            0: '0',
            50: '.5',
            100: '1',
          },
          backgroundColors: ({ theme }) => theme('colors'),
        },
      },
      {
        theme: {
          extend: {
            opacity: {
              25: '25',
              75: '.75',
            },
            backgroundColors: {
              customBackground: '#bada55',
            },
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
      },
      opacity: {
        0: '0',
        50: '.5',
        100: '1',
        25: '25',
        75: '.75',
      },
      backgroundColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
        customBackground: '#bada55',
      },
    })
  })

  test('theme values in the extend section extend the user theme', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          opacity: {
            0: '0',
            50: '.5',
            100: '1',
          },
          height: {
            0: 0,
            full: '100%',
          },
          width: {
            0: 0,
            1: '.25rem',
            2: '.5rem',
            3: '.75rem',
            4: '1rem',
          },
        },
      },
      {
        theme: {
          opacity: {
            0: '0',
            20: '.2',
            40: '.4',
          },
          height: ({ theme }) => theme('width'),
          extend: {
            opacity: {
              60: '.6',
              80: '.8',
              100: '1',
            },
            height: {
              customHeight: '500vh',
            },
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      opacity: {
        0: '0',
        20: '.2',
        40: '.4',
        60: '.6',
        80: '.8',
        100: '1',
      },
      height: {
        0: 0,
        1: '.25rem',
        2: '.5rem',
        3: '.75rem',
        4: '1rem',
        customHeight: '500vh',
      },
      width: {
        0: 0,
        1: '.25rem',
        2: '.5rem',
        3: '.75rem',
        4: '1rem',
      },
    })
  })

  it('can extend values that are depended on lazily', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            cyan: 'cyan',
            magenta: 'magenta',
            yellow: 'yellow',
          },
          backgroundColors: ({ theme }) => theme('colors'),
        },
      },
      {
        theme: {
          extend: {
            colors: {
              red: 'red',
              green: 'green',
              blue: 'blue',
            },
            backgroundColors: {
              customBackground: '#bada55',
            },
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColors: {
        cyan: 'cyan',
        magenta: 'magenta',
        yellow: 'yellow',
        red: 'red',
        green: 'green',
        blue: 'blue',
        customBackground: '#bada55',
      },
    })
  })

  it('shallow merges extensions when they are simple arrays', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          fonts: {
            sans: ['system-ui', 'Helvetica Neue', 'sans-serif'],
            serif: ['Constantia', 'Georgia', 'serif'],
            mono: ['Menlo', 'Courier New', 'monospace'],
          },
        },
      },
      {
        theme: {
          extend: {
            fonts: {
              sans: ['Comic Sans'],
              serif: ['Papyrus', { fontFeatureSettings: '"cv11"' }],
              mono: [['Lobster', 'Papyrus'], { fontFeatureSettings: '"cv11"' }],
            },
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      fonts: {
        sans: ['Comic Sans'],
        serif: ['Papyrus', { fontFeatureSettings: '"cv11"' }],
        mono: [['Lobster', 'Papyrus'], { fontFeatureSettings: '"cv11"' }],
      },
    })
  })

  it('deep merges extensions when they are arrays of objects', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          typography: {
            ArrayArray: {
              css: [{ a: { underline: 'none' } }],
            },
            ObjectArray: {
              css: [{ a: { underline: 'none' } }],
            },
            ArrayObject: {
              css: { a: { underline: 'none' } },
            },
          },
        },
      },
      {
        theme: {
          extend: {
            typography: {
              ArrayArray: {
                css: [{ a: { backgroundColor: 'red' } }, { a: { color: 'green' } }],
              },
              ObjectArray: {
                css: { a: { backgroundColor: 'red' } },
              },
              ArrayObject: {
                css: [{ a: { backgroundColor: 'red' } }, { a: { color: 'green' } }],
              },
            },
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      typography: {
        ArrayArray: {
          css: [
            { a: { underline: 'none' } },
            { a: { backgroundColor: 'red' } },
            { a: { color: 'green' } },
          ],
        },
        ObjectArray: {
          css: [{ a: { underline: 'none' } }, { a: { backgroundColor: 'red' } }],
        },
        ArrayObject: {
          css: [
            { a: { underline: 'none' } },
            { a: { backgroundColor: 'red' } },
            { a: { color: 'green' } },
          ],
        },
      },
    })
  })

  it('uses a default value passed to the `theme` function when the key is missing', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            cyan: 'cyan',
            magenta: 'magenta',
            yellow: 'yellow',
          },
          borderColor: ({ theme }) => ({
            default: theme('colors.gray', 'currentColor'),
            ...theme('colors'),
          }),
        },
      },
      {
        theme: {
          colors: {
            red: 'red',
            green: 'green',
            blue: 'blue',
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      borderColor: {
        default: 'currentColor',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    })
  })

  it('lets the `theme` function resolve simple keypaths', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            red: 'red',
            green: 'green',
            blue: 'blue',
          },
        },
      },
      {
        theme: {
          textColor: ({ theme }) => ({
            lime: 'lime',
            ...theme('colors'),
          }),
          backgroundColor: ({ theme }) => ({
            orange: 'orange',
            ...theme('textColor'),
          }),
          borderColor: ({ theme }) => theme('backgroundColor'),
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      textColor: {
        lime: 'lime',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      backgroundColor: {
        lime: 'lime',
        orange: 'orange',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      borderColor: {
        lime: 'lime',
        orange: 'orange',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    })
  })

  it('lets the `theme` function resolve nested keypaths', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          spacing: {
            0: '0',
          },
          width: ({ theme }) => ({
            ...theme('spacing'),
            '1/3': '33.33333%',
          }),
        },
      },
      {
        theme: {
          minWidth: ({ theme }) => ({
            '1/3': theme('width.1/3'),
          }),
        },
      },
    ])

    expect(config.theme).toMatchObject({
      spacing: {
        0: '0',
      },
      width: {
        0: '0',
        '1/3': '33.33333%',
      },
      minWidth: {
        '1/3': '33.33333%',
      },
    })
  })

  test('theme values in the extend section are lazily evaluated', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            cyan: 'cyan',
            magenta: 'magenta',
            yellow: 'yellow',
          },
          borderColor: ({ theme }) => ({
            default: theme('colors.yellow', 'currentColor'),
            ...theme('colors'),
          }),
        },
      },
      {
        theme: {
          colors: {
            red: 'red',
            green: 'green',
            blue: 'blue',
          },
          extend: {
            colors: {
              orange: 'orange',
            },
            borderColor: ({ theme }) => ({
              foo: theme('colors.orange'),
              bar: theme('colors.red'),
            }),
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        orange: 'orange',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
      borderColor: {
        default: 'currentColor',
        foo: 'orange',
        bar: 'red',
        orange: 'orange',
        red: 'red',
        green: 'green',
        blue: 'blue',
      },
    })
  })

  test('lazily evaluated values have access to the config utils', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          spacing: {
            1: '1px',
            2: '2px',
            3: '3px',
            4: '4px',
          },
          margin: ({ theme }) => ({ ...theme('spacing') }),
        },
      },
      {
        theme: {
          inset: ({ theme }) => theme('margin'),
          shift: ({ theme }) => ({ ...theme('spacing') }),
          extend: {
            nudge: ({ theme }) => ({ ...theme('spacing') }),
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      spacing: {
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },
      inset: {
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },
      margin: {
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },
      shift: {
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },
      nudge: {
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
      },
    })
  })

  it('does not mutate the original theme', async () => {
    const userConfig: UserConfig = {
      theme: {
        extend: {
          colors: {
            orange: 'orange',
          },
        },
      },
    }

    resolver.resolve([
      {
        theme: {
          colors: {
            cyan: 'cyan',
            magenta: 'magenta',
            yellow: 'yellow',
          },
        },
      },
      userConfig,
    ])

    expect(userConfig).toEqual({
      theme: {
        extend: {
          colors: {
            orange: 'orange',
          },
        },
      },
    })
  })

  it('allows plugins to extend user themes', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      {
        theme: {
          width: {
            sm: '1rem',
            md: '2rem',
            lg: '3rem',
          },
          screens: {
            mobile: '400px',
          },
        },
      },
      {
        theme: {
          width: {
            '1px': '1px',
          },
        },
        plugins: [
          stub(1, {
            theme: {
              extend: {
                width: {
                  '2px': '2px',
                  '3px': '3px',
                },
              },
            },
          }),
        ],
      },
    ])

    expect(config).toMatchObject({
      theme: {
        width: {
          '1px': '1px',
          '2px': '2px',
          '3px': '3px',
        },
        screens: {
          mobile: '400px',
        },
      },
      plugins: stub.all,
    })
  })

  it('prefers user theme extensions over plugin theme extensions', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      {
        theme: {
          width: {
            sm: '1rem',
            md: '2rem',
            lg: '3rem',
          },
          screens: {
            mobile: '400px',
          },
        },
      },
      {
        theme: {
          extend: {
            width: {
              xl: '6rem',
            },
          },
        },
        plugins: [
          stub(1, {
            theme: {
              extend: {
                width: {
                  xl: '4rem',
                },
              },
            },
          }),
        ],
      },
    ])

    expect(config).toMatchObject({
      theme: {
        width: {
          sm: '1rem',
          md: '2rem',
          lg: '3rem',
          xl: '6rem',
        },
        screens: {
          mobile: '400px',
        },
      },
      plugins: stub.all,
    })
  })

  it('uses values from later theme extensions', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          colors: {
            grey: {
              light: '#ccc',
              dark: '#333',
            },
          },
        },
      },
      {
        theme: {
          extend: {
            colors: {
              grey: {
                darker: '#222',
              },
            },
          },
        },
      },
      {
        theme: {
          extend: {
            colors: {
              grey: {
                light: '#ddd',
                darker: '#111',
              },
            },
          },
        },
      },
      {
        theme: {
          extend: {
            colors: {
              grey: {
                light: '#eee',
              },
            },
          },
        },
      },
    ])

    expect(config.theme).toMatchObject({
      colors: {
        grey: {
          light: '#eee',
          dark: '#333',
          darker: '#111',
        },
      },
    })
  })

  it('provides helpers to resolvable theme functions', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          screens: {
            sm: '640px',
            md: '768px',
          },
          fontWeight: {
            bold: 700,
          },
          spacing: {
            0: '0px',
            1: '1px',
            2: '2px',
            3: '3px',
            4: '4px',
          },
        },
      },
      {
        theme: {
          example: ({ theme, colors, breakpoints }) => ({
            weight: theme('fontWeight.bold'),
            black: colors.black,
            white: colors.white,
            ...breakpoints(theme('screens')),
          }),
        },
      },
    ])

    expect(config.theme).toMatchObject({
      example: {
        weight: 700,
        black: '#000',
        white: '#fff',
        'screen-sm': '640px',
        'screen-md': '768px',
      },
    })
  })

  it('replaces theme keys with later configs', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          animation: {
            some: 'some',
          },
        },
      },
      {
        theme: {
          animation: {
            none: 'none',
          },
        },
      },
    ])

    expect(config.theme).toEqual({
      animation: {
        none: 'none',
      },
    })
  })

  it('merges extend into theme keys', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          extend: {
            animation: {
              none: 'none',
            },
          },

          animation: {
            some: 'some',
          },
        },
      },
      {
        theme: {
          extend: {
            animation: {
              every: 'every',
            },
          },
        },
      },
    ])

    expect(config.theme).toEqual({
      animation: {
        none: 'none',
        some: 'some',
        every: 'every',
      },
    })
  })

  it('presets can add to theme and theme.extend', async () => {
    let config = await resolver.resolve([
      {
        presets: [
          {
            theme: {
              extend: {
                animation: {
                  some: 'some',
                },
              },

              animation: {
                none: 'none',
              },
            },
          },
        ],
      },
    ])

    expect(config.theme).toEqual({
      animation: {
        none: 'none',
        some: 'some',
      },
    })
  })

  it('plugins can add to theme and theme.extend', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      {
        plugins: [
          stub(1, {
            theme: {
              extend: {
                animation: {
                  some: 'some',
                },
              },

              animation: {
                none: 'none',
              },
            },
          }),
        ],
      },
    ])

    expect(config).toMatchObject({
      plugins: stub.all,
    })

    expect(config.theme).toEqual({
      animation: {
        none: 'none',
        some: 'some',
      },
    })
  })

  it('calls top-level theme keys when given functions', async () => {
    let config = await resolver.resolve([
      {
        theme: {
          extend: {
            animation: () => ({
              some: 'some',
            }),
          },

          animation: () => ({
            none: 'none',
          }),
        },
      },
    ])

    expect(config.theme).toEqual({
      animation: {
        some: 'some',
        none: 'none',
      },
    })
  })
})

describe('plugins', () => {
  it('lets plugins modify the config', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      //
      { prefix: '' },
      { plugins: [stub(1, { prefix: 'tw-' })] },
    ])

    expect(config).toMatchObject({
      prefix: 'tw-',
      plugins: stub.all,
    })
  })

  it('prefers user configs over plugin configs', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      { prefix: '' },
      {
        prefix: 'user-',
        plugins: [stub(1, { prefix: 'tw-' })],
      },
    ])

    expect(config).toMatchObject({
      prefix: 'user-',
      plugins: stub.all,
    })
  })

  it('allows plugins to register plugins', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      {
        prefix: '',
        important: false,
        separator: ':',
      },
      {
        plugins: [
          stub(1, {
            prefix: 'tw-',
            plugins: [
              stub(2, {
                important: true,
              }),
              stub(3, {
                separator: '_',
              }),
            ],
          }),
        ],
      },
    ])

    expect(config).toMatchObject({
      prefix: 'tw-',
      important: true,
      separator: '_',
      plugins: stub.all,
    })
  })

  it('prefers outer plugin configs instead of inner plugin configs (todo -- terrible name)', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      {
        prefix: '',
      },
      {
        plugins: [
          stub(1, {
            prefix: 'outer-',
            plugins: [
              stub(2, {
                prefix: 'inner-',
              }),
            ],
          }),
        ],
      },
    ])

    expect(config).toMatchObject({
      prefix: 'outer-',
      plugins: stub.all,
    })
  })

  it('merges plugins across configs', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      { plugins: [stub(1)] },
      { plugins: [stub(2)] },
      { plugins: [stub(3)] },
    ])

    expect(config).toMatchObject({
      plugins: stub.all,
    })
  })

  it('merges plugins from presets (recursively)', async () => {
    let stub = stubs()

    let config = await resolver.resolve([
      // Plugins from multiple configs
      { plugins: [stub(1), stub(2)] },
      { plugins: [stub(3), stub(4)] },

      {
        presets: [
          // Plugins from presets
          { plugins: [stub(11), stub(12)] },

          // Plugins from presets (recursively)
          {
            presets: [{ plugins: [stub(21), stub(22)] }],
            plugins: [stub(23)],
          },

          // Plugins from presets inside plugins
          {
            plugins: [
              stub(31, {
                presets: [{ plugins: [stub(32), stub(33)] }],
              }),
            ],
          },
        ],
      },

      {
        plugins: [
          // Plugins from plugins
          stub(41, {
            plugins: [stub(42), stub(43)],
          }),

          // Plugins from plugins (recursively)
          stub(51, {
            plugins: [
              stub(52, {
                plugins: [stub(53)],
              }),
            ],
          }),
        ],
      },
    ])

    expect(config).toMatchObject({
      plugins: stub.all,
    })
  })
})

describe('core plugins', () => {
  it('can disable all core plugins', async () => {
    let config = await resolver.resolve([
      //
      { corePlugins: false },
    ])

    expect(config.corePlugins).toStrictEqual(corePluginsDisabled)
  })

  it('can enable only some core plugins', async () => {
    let config = await resolver.resolve([
      //
      { corePlugins: ['colors', 'display'] },
    ])

    expect(config.corePlugins).toStrictEqual({
      ...corePluginsDisabled,
      colors: true,
      display: true,
    })
  })

  it('can disable select core plugins', async () => {
    let config = await resolver.resolve([{ corePlugins: { colors: false, display: false } }])

    expect(config.corePlugins).toStrictEqual({
      ...corePlugins,
      colors: false,
      display: false,
    })
  })

  it('starts with default list of core plugins', async () => {
    let config = await resolver.resolve([{ corePlugins: {} }, { corePlugins: { display: false } }])

    expect(config).toMatchObject({
      corePlugins: {
        ...corePlugins,
        display: false,
      },
    })
  })

  it('can re-enable disabled core plugins', async () => {
    let config = await resolver.resolve([
      { corePlugins: { display: false } },
      { corePlugins: { display: true } },
    ])

    expect(config).toMatchObject({
      corePlugins: {
        display: true,
      },
    })
  })

  it('merges core plugins across configs', async () => {
    let config = await resolver.resolve([
      { corePlugins: ['colors', 'display', 'height'] },
      { corePlugins: { truncate: true } },
      { corePlugins: { display: false } },
    ])

    expect(config.corePlugins).toStrictEqual({
      ...corePluginsDisabled,
      colors: true,
      height: true,
      truncate: true,
    })
  })
})
