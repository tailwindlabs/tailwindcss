import { describe, expect, test, vi } from 'vitest'
import { compile } from '..'
import plugin from '../plugin'
import { optimizeCss } from '../test-utils/run'
import defaultTheme from './default-theme'
import type { CssInJs, PluginAPI } from './plugin-api'

const css = String.raw

describe('theme', async () => {
  test('plugin theme can contain objects', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ addBase, theme }) {
              addBase({
                '@keyframes enter': theme('keyframes.enter'),
                '@keyframes exit': theme('keyframes.exit'),
              })
            },
            {
              theme: {
                extend: {
                  keyframes: {
                    enter: {
                      from: {
                        opacity: 'var(--tw-enter-opacity, 1)',
                        transform:
                          'translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))',
                      },
                    },
                    exit: {
                      to: {
                        opacity: 'var(--tw-exit-opacity, 1)',
                        transform:
                          'translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))',
                      },
                    },
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build([])).toMatchInlineSnapshot(`
      "@layer base {
        @keyframes enter {
          from {
            opacity: var(--tw-enter-opacity, 1);
            transform: translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0));
          }
        }
        @keyframes exit {
          to {
            opacity: var(--tw-exit-opacity, 1);
            transform: translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0));
          }
        }
      }
      "
    `)
  })

  test('keyframes added via addUtilities are appended to the AST', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(function ({ addUtilities, theme }) {
            addUtilities({
              '@keyframes enter': {
                from: {
                  opacity: 'var(--tw-enter-opacity, 1)',
                },
              },
            })
          }),
        }
      },
    })

    expect(compiler.build([])).toMatchInlineSnapshot(`
      "@keyframes enter {
        from {
          opacity: var(--tw-enter-opacity, 1);
        }
      }
      "
    `)
  })

  test('plugin theme can extend colors', async () => {
    let input = css`
      @theme reference {
        --color-red-500: #ef4444;
      }
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                {
                  scrollbar: (value) => ({ 'scrollbar-color': value }),
                },
                {
                  values: theme('colors'),
                },
              )
            },
            {
              theme: {
                extend: {
                  colors: {
                    'russet-700': '#7a4724',
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build(['scrollbar-red-500', 'scrollbar-russet-700'])).toMatchInlineSnapshot(`
      ".scrollbar-red-500 {
        scrollbar-color: #ef4444;
      }
      .scrollbar-russet-700 {
        scrollbar-color: #7a4724;
      }
      "
    `)
  })

  test('plugin theme values can reference legacy theme keys that have been replaced with bare value support', async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                {
                  'animate-duration': (value) => ({ 'animation-duration': value }),
                },
                {
                  values: theme('animationDuration'),
                },
              )
            },
            {
              theme: {
                extend: {
                  animationDuration: ({ theme }: { theme: (path: string) => any }) => {
                    return {
                      ...theme('transitionDuration'),
                    }
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build(['animate-duration-316'])).toMatchInlineSnapshot(`
      ".animate-duration-316 {
        animation-duration: 316ms;
      }
      "
    `)
  })

  test('plugin theme values that support bare values are merged with other values for that theme key', async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                {
                  'animate-duration': (value) => ({ 'animation-duration': value }),
                },
                {
                  values: theme('animationDuration'),
                },
              )
            },
            {
              theme: {
                extend: {
                  transitionDuration: {
                    slow: '800ms',
                  },

                  animationDuration: ({ theme }: { theme: (path: string) => any }) => ({
                    ...theme('transitionDuration'),
                  }),
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build(['animate-duration-316', 'animate-duration-slow']))
      .toMatchInlineSnapshot(`
        ".animate-duration-316 {
          animation-duration: 316ms;
        }
        .animate-duration-slow {
          animation-duration: 800ms;
        }
        "
      `)
  })

  test('plugin theme can have opacity modifiers', async () => {
    let input = css`
      @tailwind utilities;
      @theme {
        --color-red-500: #ef4444;
      }
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(function ({ addUtilities, theme }) {
            addUtilities({
              '.percentage': {
                color: theme('colors.red.500 / 50%'),
              },
              '.fraction': {
                color: theme('colors.red.500 / 0.5'),
              },
              '.variable': {
                color: theme('colors.red.500 / var(--opacity)'),
              },
            })
          }),
        }
      },
    })

    expect(compiler.build(['percentage', 'fraction', 'variable'])).toMatchInlineSnapshot(`
      ".fraction {
        color: color-mix(in oklab, #ef4444 50%, transparent);
      }
      .percentage {
        color: color-mix(in oklab, #ef4444 50%, transparent);
      }
      .variable {
        color: #ef4444;
        @supports (color: color-mix(in lab, red, red)) {
          color: color-mix(in oklab, #ef4444 var(--opacity), transparent);
        }
      }
      "
    `)
  })

  test('plugin theme colors can use <alpha-value>', async () => {
    let input = css`
      @tailwind utilities;
      @theme {
        /* This should not work */
        --color-custom-css: rgba(255 0 0 / <alpha-value>);
      }
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ addUtilities, theme }) {
              addUtilities({
                '.css-percentage': {
                  color: theme('colors.custom-css / 50%'),
                },
                '.css-fraction': {
                  color: theme('colors.custom-css / 0.5'),
                },
                '.css-variable': {
                  color: theme('colors.custom-css / var(--opacity)'),
                },
                '.js-percentage': {
                  color: theme('colors.custom-js / 50%'),
                },
                '.js-fraction': {
                  color: theme('colors.custom-js / 0.5'),
                },
                '.js-variable': {
                  color: theme('colors.custom-js / var(--opacity)'),
                },
              })
            },
            {
              theme: {
                colors: {
                  /* This should work */
                  'custom-js': 'rgb(255 0 0 / <alpha-value>)',
                },
              },
            },
          ),
        }
      },
    })

    expect(
      compiler.build([
        'bg-custom',
        'css-percentage',
        'css-fraction',
        'css-variable',
        'js-percentage',
        'js-fraction',
        'js-variable',
      ]),
    ).toMatchInlineSnapshot(`
      ".css-fraction {
        color: color-mix(in oklab, rgba(255 0 0 / <alpha-value>) 50%, transparent);
      }
      .css-percentage {
        color: color-mix(in oklab, rgba(255 0 0 / <alpha-value>) 50%, transparent);
      }
      .css-variable {
        color: rgba(255 0 0 / <alpha-value>);
        @supports (color: color-mix(in lab, red, red)) {
          color: color-mix(in oklab, rgba(255 0 0 / <alpha-value>) var(--opacity), transparent);
        }
      }
      .js-fraction {
        color: color-mix(in oklab, rgb(255 0 0 / 1) 50%, transparent);
      }
      .js-percentage {
        color: color-mix(in oklab, rgb(255 0 0 / 1) 50%, transparent);
      }
      .js-variable {
        color: rgb(255 0 0 / 1);
        @supports (color: color-mix(in lab, red, red)) {
          color: color-mix(in oklab, rgb(255 0 0 / 1) var(--opacity), transparent);
        }
      }
      "
    `)
  })

  test('theme value functions are resolved correctly regardless of order', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                {
                  'animate-delay': (value) => ({ 'animation-delay': value }),
                },
                {
                  values: theme('animationDelay'),
                },
              )
            },
            {
              theme: {
                extend: {
                  animationDuration: ({ theme }: { theme: (path: string) => any }) => ({
                    ...theme('transitionDuration'),
                  }),

                  animationDelay: ({ theme }: { theme: (path: string) => any }) => ({
                    ...theme('animationDuration'),
                  }),

                  transitionDuration: {
                    slow: '800ms',
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build(['animate-delay-316', 'animate-delay-slow'])).toMatchInlineSnapshot(`
      ".animate-delay-316 {
        animation-delay: 316ms;
      }
      .animate-delay-slow {
        animation-delay: 800ms;
      }
      "
    `)
  })

  test('plugins can override the default key', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                {
                  'animate-duration': (value) => ({ 'animation-delay': value }),
                },
                {
                  values: theme('transitionDuration'),
                },
              )
            },
            {
              theme: {
                extend: {
                  transitionDuration: {
                    DEFAULT: '1500ms',
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build(['animate-duration'])).toMatchInlineSnapshot(`
      ".animate-duration {
        animation-delay: 1500ms;
      }
      "
    `)
  })

  test('plugins can read CSS theme keys using the old theme key notation', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animate: pulse 1s linear infinite;
        --animate-spin: spin 1s linear infinite;
      }
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
              {
                animation: (value) => ({ animation: value }),
              },
              {
                values: theme('animation'),
              },
            )

            matchUtilities(
              {
                animation2: (value) => ({ animation: value }),
              },
              {
                values: {
                  DEFAULT: theme('animation.DEFAULT'),
                  twist: theme('animation.spin'),
                },
              },
            )
          }),
        }
      },
    })

    expect(compiler.build(['animation-spin', 'animation', 'animation2', 'animation2-twist']))
      .toMatchInlineSnapshot(`
        ".animation {
          animation: pulse 1s linear infinite;
        }
        .animation-spin {
          animation: spin 1s linear infinite;
        }
        .animation2 {
          animation: pulse 1s linear infinite;
        }
        .animation2-twist {
          animation: spin 1s linear infinite;
        }
        "
      `)
  })

  test('CSS theme values are merged with JS theme values', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animate: pulse 1s linear infinite;
        --animate-spin: spin 1s linear infinite;
      }
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                {
                  animation: (value) => ({ '--animation': value }),
                },
                {
                  values: theme('animation'),
                },
              )
            },
            {
              theme: {
                extend: {
                  animation: {
                    bounce: 'bounce 1s linear infinite',
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build(['animation', 'animation-spin', 'animation-bounce']))
      .toMatchInlineSnapshot(`
        ".animation {
          --animation: pulse 1s linear infinite;
        }
        .animation-bounce {
          --animation: bounce 1s linear infinite;
        }
        .animation-spin {
          --animation: spin 1s linear infinite;
        }
        "
      `)
  })

  test('CSS theme defaults take precedence over JS theme defaults', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animate: pulse 1s linear infinite;
        --animate-spin: spin 1s linear infinite;
      }
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                {
                  animation: (value) => ({ '--animation': value }),
                },
                {
                  values: theme('animation'),
                },
              )
            },
            {
              theme: {
                extend: {
                  animation: {
                    DEFAULT: 'twist 1s linear infinite',
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build(['animation'])).toMatchInlineSnapshot(`
      ".animation {
        --animation: pulse 1s linear infinite;
      }
      "
    `)
  })

  test('CSS theme values take precedence even over non-object JS values', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme reference {
        --animate-simple-spin: spin 1s linear infinite;
        --animate-simple-bounce: bounce 1s linear infinite;
      }
    `

    let fn = vi.fn()

    await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ theme }) {
              fn(theme('animation.simple'))
            },
            {
              theme: {
                extend: {
                  animation: {
                    simple: 'simple 1s linear',
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(fn).toHaveBeenCalledWith({
      __CSS_VALUES__: { bounce: 2, spin: 2 },
      spin: 'spin 1s linear infinite',
      bounce: 'bounce 1s linear infinite',
    })
  })

  test('all necessary theme keys support bare values', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let { build } = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(function ({ matchUtilities, theme }) {
            function utility(name: string, themeKey: string) {
              matchUtilities(
                { [name]: (value) => ({ '--value': value }) },
                { values: theme(themeKey) },
              )
            }

            utility('my-aspect', 'aspectRatio')
            utility('my-backdrop-brightness', 'backdropBrightness')
            utility('my-backdrop-contrast', 'backdropContrast')
            utility('my-backdrop-grayscale', 'backdropGrayscale')
            utility('my-backdrop-hue-rotate', 'backdropHueRotate')
            utility('my-backdrop-invert', 'backdropInvert')
            utility('my-backdrop-opacity', 'backdropOpacity')
            utility('my-backdrop-saturate', 'backdropSaturate')
            utility('my-backdrop-sepia', 'backdropSepia')
            utility('my-border-width', 'borderWidth')
            utility('my-brightness', 'brightness')
            utility('my-columns', 'columns')
            utility('my-contrast', 'contrast')
            utility('my-divide-width', 'divideWidth')
            utility('my-flex-grow', 'flexGrow')
            utility('my-flex-shrink', 'flexShrink')
            utility('my-gradient-color-stop-positions', 'gradientColorStopPositions')
            utility('my-grayscale', 'grayscale')
            utility('my-grid-row-end', 'gridRowEnd')
            utility('my-grid-row-start', 'gridRowStart')
            utility('my-grid-template-columns', 'gridTemplateColumns')
            utility('my-grid-template-rows', 'gridTemplateRows')
            utility('my-hue-rotate', 'hueRotate')
            utility('my-invert', 'invert')
            utility('my-line-clamp', 'lineClamp')
            utility('my-opacity', 'opacity')
            utility('my-order', 'order')
            utility('my-outline-offset', 'outlineOffset')
            utility('my-outline-width', 'outlineWidth')
            utility('my-ring-offset-width', 'ringOffsetWidth')
            utility('my-ring-width', 'ringWidth')
            utility('my-rotate', 'rotate')
            utility('my-saturate', 'saturate')
            utility('my-scale', 'scale')
            utility('my-sepia', 'sepia')
            utility('my-skew', 'skew')
            utility('my-stroke-width', 'strokeWidth')
            utility('my-text-decoration-thickness', 'textDecorationThickness')
            utility('my-text-underline-offset', 'textUnderlineOffset')
            utility('my-transition-delay', 'transitionDelay')
            utility('my-transition-duration', 'transitionDuration')
            utility('my-z-index', 'zIndex')
          }),
        }
      },
    })

    let output = build([
      'my-aspect-2/5',
      'my-backdrop-brightness-1',
      'my-backdrop-contrast-1',
      'my-backdrop-grayscale-1',
      'my-backdrop-hue-rotate-1',
      'my-backdrop-invert-1',
      'my-backdrop-opacity-1',
      'my-backdrop-saturate-1',
      'my-backdrop-sepia-1',
      'my-border-width-1',
      'my-brightness-1',
      'my-columns-1',
      'my-contrast-1',
      'my-divide-width-1',
      'my-flex-grow-1',
      'my-flex-shrink-1',
      'my-gradient-color-stop-positions-1',
      'my-grayscale-1',
      'my-grid-row-end-1',
      'my-grid-row-start-1',
      'my-grid-template-columns-1',
      'my-grid-template-rows-1',
      'my-hue-rotate-1',
      'my-invert-1',
      'my-line-clamp-1',
      'my-opacity-1',
      'my-order-1',
      'my-outline-offset-1',
      'my-outline-width-1',
      'my-ring-offset-width-1',
      'my-ring-width-1',
      'my-rotate-1',
      'my-saturate-1',
      'my-scale-1',
      'my-sepia-1',
      'my-skew-1',
      'my-stroke-width-1',
      'my-text-decoration-thickness-1',
      'my-text-underline-offset-1',
      'my-transition-delay-1',
      'my-transition-duration-1',
      'my-z-index-1',
    ])

    expect(output).toMatchInlineSnapshot(`
      ".my-aspect-2\\/5 {
        --value: 2/5;
      }
      .my-backdrop-brightness-1 {
        --value: 1%;
      }
      .my-backdrop-contrast-1 {
        --value: 1%;
      }
      .my-backdrop-grayscale-1 {
        --value: 1%;
      }
      .my-backdrop-hue-rotate-1 {
        --value: 1deg;
      }
      .my-backdrop-invert-1 {
        --value: 1%;
      }
      .my-backdrop-opacity-1 {
        --value: 1%;
      }
      .my-backdrop-saturate-1 {
        --value: 1%;
      }
      .my-backdrop-sepia-1 {
        --value: 1%;
      }
      .my-border-width-1 {
        --value: 1px;
      }
      .my-brightness-1 {
        --value: 1%;
      }
      .my-columns-1 {
        --value: 1;
      }
      .my-contrast-1 {
        --value: 1%;
      }
      .my-divide-width-1 {
        --value: 1px;
      }
      .my-flex-grow-1 {
        --value: 1;
      }
      .my-flex-shrink-1 {
        --value: 1;
      }
      .my-gradient-color-stop-positions-1 {
        --value: 1%;
      }
      .my-grayscale-1 {
        --value: 1%;
      }
      .my-grid-row-end-1 {
        --value: 1;
      }
      .my-grid-row-start-1 {
        --value: 1;
      }
      .my-grid-template-columns-1 {
        --value: repeat(1, minmax(0, 1fr));
      }
      .my-grid-template-rows-1 {
        --value: repeat(1, minmax(0, 1fr));
      }
      .my-hue-rotate-1 {
        --value: 1deg;
      }
      .my-invert-1 {
        --value: 1%;
      }
      .my-line-clamp-1 {
        --value: 1;
      }
      .my-opacity-1 {
        --value: 1%;
      }
      .my-order-1 {
        --value: 1;
      }
      .my-outline-offset-1 {
        --value: 1px;
      }
      .my-outline-width-1 {
        --value: 1px;
      }
      .my-ring-offset-width-1 {
        --value: 1px;
      }
      .my-ring-width-1 {
        --value: 1px;
      }
      .my-rotate-1 {
        --value: 1deg;
      }
      .my-saturate-1 {
        --value: 1%;
      }
      .my-scale-1 {
        --value: 1%;
      }
      .my-sepia-1 {
        --value: 1%;
      }
      .my-skew-1 {
        --value: 1deg;
      }
      .my-stroke-width-1 {
        --value: 1;
      }
      .my-text-decoration-thickness-1 {
        --value: 1px;
      }
      .my-text-underline-offset-1 {
        --value: 1px;
      }
      .my-transition-delay-1 {
        --value: 1ms;
      }
      .my-transition-duration-1 {
        --value: 1ms;
      }
      .my-z-index-1 {
        --value: 1;
      }
      "
    `)
  })

  test('theme keys can derive from other theme keys', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme {
        --color-primary: red;
        --color-secondary: blue;
      }
    `

    let fn = vi.fn()

    await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            ({ theme }) => {
              // The compatibility config specifies that `accentColor` spreads in `colors`
              fn(theme('accentColor.primary'))

              // This should even work for theme keys specified in plugin configs
              fn(theme('myAccentColor.secondary'))
            },
            {
              theme: {
                extend: {
                  myAccentColor: ({ theme }) => theme('accentColor'),
                },
              },
            },
          ),
        }
      },
    })

    expect(fn).toHaveBeenCalledWith('red')
    expect(fn).toHaveBeenCalledWith('blue')
  })

  test("`theme('*.DEFAULT')` resolves to `undefined` when all theme keys in that namespace have a suffix", async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme {
        --ease-in: ease-in;
        --ease-out: ease-out;
      }
    `

    let fn = vi.fn()

    await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(({ theme }) => {
            fn(theme('transitionTimingFunction.DEFAULT'))
            fn(theme('transitionTimingFunction.in'))
            fn(theme('transitionTimingFunction.out'))
          }),
        }
      },
    })

    expect(fn).toHaveBeenNthCalledWith(1, undefined)
    expect(fn).toHaveBeenNthCalledWith(2, 'ease-in')
    expect(fn).toHaveBeenNthCalledWith(3, 'ease-out')
  })

  test('nested theme key lookups work even for flattened keys', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
      @theme {
        --color-red-100: red;
        --color-red-200: orangered;
        --color-red-300: darkred;
      }
    `

    let fn = vi.fn()

    await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(({ theme }) => {
            fn(theme('color.red.100'))
            fn(theme('colors.red.200'))
            fn(theme('backgroundColor.red.300'))
          }),
        }
      },
    })

    expect(fn).toHaveBeenCalledWith('red')
    expect(fn).toHaveBeenCalledWith('orangered')
    expect(fn).toHaveBeenCalledWith('darkred')
  })

  test('keys that do not exist return the default value (or undefined if none)', async ({
    expect,
  }) => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let fn = vi.fn()

    await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(({ theme }) => {
            fn(theme('i.do.not.exist'))
            fn(theme('color'))
            fn(theme('color', 'magenta'))
            fn(theme('colors'))
          }),
        }
      },
    })

    expect(fn).toHaveBeenCalledWith(undefined) // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith(undefined) // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith('magenta') // Not present in CSS or resolved config
    expect(fn).toHaveBeenCalledWith({}) // Present in the resolved config
  })

  test('Candidates can match multiple utility definitions', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let { build } = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(({ addUtilities, matchUtilities }) => {
            addUtilities({
              '.foo-bar': {
                color: 'red',
              },
            })

            matchUtilities(
              {
                foo: (value) => ({
                  '--my-prop': value,
                }),
              },
              {
                values: {
                  bar: 'bar-valuer',
                  baz: 'bar-valuer',
                },
              },
            )

            addUtilities({
              '.foo-bar': {
                backgroundColor: 'red',
              },
            })
          }),
        }
      },
    })

    expect(build(['foo-bar'])).toMatchInlineSnapshot(`
      ".foo-bar {
        background-color: red;
      }
      .foo-bar {
        color: red;
      }
      .foo-bar {
        --my-prop: bar-valuer;
      }
      "
    `)
  })

  test('spreading `tailwindcss/defaultTheme` exports keeps bare values', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let { build } = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(function ({ matchUtilities }) {
            function utility(name: string, themeKey: string) {
              matchUtilities(
                { [name]: (value) => ({ '--value': value }) },
                // @ts-ignore
                { values: defaultTheme[themeKey] },
              )
            }

            utility('my-aspect', 'aspectRatio')
            // The following keys deliberately doesn't work as these are exported
            // as functions from the compat config.
            //
            // utility('my-backdrop-brightness', 'backdropBrightness')
            // utility('my-backdrop-contrast', 'backdropContrast')
            // utility('my-backdrop-grayscale', 'backdropGrayscale')
            // utility('my-backdrop-hue-rotate', 'backdropHueRotate')
            // utility('my-backdrop-invert', 'backdropInvert')
            // utility('my-backdrop-opacity', 'backdropOpacity')
            // utility('my-backdrop-saturate', 'backdropSaturate')
            // utility('my-backdrop-sepia', 'backdropSepia')
            // utility('my-divide-width', 'divideWidth')
            utility('my-border-width', 'borderWidth')
            utility('my-brightness', 'brightness')
            utility('my-columns', 'columns')
            utility('my-contrast', 'contrast')
            utility('my-flex-grow', 'flexGrow')
            utility('my-flex-shrink', 'flexShrink')
            utility('my-gradient-color-stop-positions', 'gradientColorStopPositions')
            utility('my-grayscale', 'grayscale')
            utility('my-grid-row-end', 'gridRowEnd')
            utility('my-grid-row-start', 'gridRowStart')
            utility('my-grid-template-columns', 'gridTemplateColumns')
            utility('my-grid-template-rows', 'gridTemplateRows')
            utility('my-hue-rotate', 'hueRotate')
            utility('my-invert', 'invert')
            utility('my-line-clamp', 'lineClamp')
            utility('my-opacity', 'opacity')
            utility('my-order', 'order')
            utility('my-outline-offset', 'outlineOffset')
            utility('my-outline-width', 'outlineWidth')
            utility('my-ring-offset-width', 'ringOffsetWidth')
            utility('my-ring-width', 'ringWidth')
            utility('my-rotate', 'rotate')
            utility('my-saturate', 'saturate')
            utility('my-scale', 'scale')
            utility('my-sepia', 'sepia')
            utility('my-skew', 'skew')
            utility('my-stroke-width', 'strokeWidth')
            utility('my-text-decoration-thickness', 'textDecorationThickness')
            utility('my-text-underline-offset', 'textUnderlineOffset')
            utility('my-transition-delay', 'transitionDelay')
            utility('my-transition-duration', 'transitionDuration')
            utility('my-z-index', 'zIndex')
          }),
        }
      },
    })

    let output = build([
      'my-aspect-2/5',
      // 'my-backdrop-brightness-1',
      // 'my-backdrop-contrast-1',
      // 'my-backdrop-grayscale-1',
      // 'my-backdrop-hue-rotate-1',
      // 'my-backdrop-invert-1',
      // 'my-backdrop-opacity-1',
      // 'my-backdrop-saturate-1',
      // 'my-backdrop-sepia-1',
      // 'my-divide-width-1',
      'my-border-width-1',
      'my-brightness-1',
      'my-columns-1',
      'my-contrast-1',
      'my-flex-grow-1',
      'my-flex-shrink-1',
      'my-gradient-color-stop-positions-1',
      'my-grayscale-1',
      'my-grid-row-end-1',
      'my-grid-row-start-1',
      'my-grid-template-columns-1',
      'my-grid-template-rows-1',
      'my-hue-rotate-1',
      'my-invert-1',
      'my-line-clamp-1',
      'my-opacity-1',
      'my-order-1',
      'my-outline-offset-1',
      'my-outline-width-1',
      'my-ring-offset-width-1',
      'my-ring-width-1',
      'my-rotate-1',
      'my-saturate-1',
      'my-scale-1',
      'my-sepia-1',
      'my-skew-1',
      'my-stroke-width-1',
      'my-text-decoration-thickness-1',
      'my-text-underline-offset-1',
      'my-transition-delay-1',
      'my-transition-duration-1',
      'my-z-index-1',
    ])

    expect(output).toMatchInlineSnapshot(`
      ".my-aspect-2\\/5 {
        --value: 2/5;
      }
      .my-border-width-1 {
        --value: 1px;
      }
      .my-brightness-1 {
        --value: 1%;
      }
      .my-columns-1 {
        --value: 1;
      }
      .my-contrast-1 {
        --value: 1%;
      }
      .my-flex-grow-1 {
        --value: 1;
      }
      .my-flex-shrink-1 {
        --value: 1;
      }
      .my-gradient-color-stop-positions-1 {
        --value: 1%;
      }
      .my-grayscale-1 {
        --value: 1%;
      }
      .my-grid-row-end-1 {
        --value: 1;
      }
      .my-grid-row-start-1 {
        --value: 1;
      }
      .my-grid-template-columns-1 {
        --value: repeat(1, minmax(0, 1fr));
      }
      .my-grid-template-rows-1 {
        --value: repeat(1, minmax(0, 1fr));
      }
      .my-hue-rotate-1 {
        --value: 1deg;
      }
      .my-invert-1 {
        --value: 1%;
      }
      .my-line-clamp-1 {
        --value: 1;
      }
      .my-opacity-1 {
        --value: 1%;
      }
      .my-order-1 {
        --value: 1;
      }
      .my-outline-offset-1 {
        --value: 1px;
      }
      .my-outline-width-1 {
        --value: 1px;
      }
      .my-ring-offset-width-1 {
        --value: 1px;
      }
      .my-ring-width-1 {
        --value: 1px;
      }
      .my-rotate-1 {
        --value: 1deg;
      }
      .my-saturate-1 {
        --value: 1%;
      }
      .my-scale-1 {
        --value: 1%;
      }
      .my-sepia-1 {
        --value: 1%;
      }
      .my-skew-1 {
        --value: 1deg;
      }
      .my-stroke-width-1 {
        --value: 1;
      }
      .my-text-decoration-thickness-1 {
        --value: 1px;
      }
      .my-text-underline-offset-1 {
        --value: 1px;
      }
      .my-transition-delay-1 {
        --value: 1ms;
      }
      .my-transition-duration-1 {
        --value: 1ms;
      }
      .my-z-index-1 {
        --value: 1;
      }
      "
    `)
  })

  test('can use escaped JS variables in theme values', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                { 'my-width': (value) => ({ width: value }) },
                { values: theme('width') },
              )
            },
            {
              theme: {
                extend: {
                  width: {
                    '1': '0.25rem',
                    // Purposely setting to something different from the v3 default
                    '1/2': '60%',
                    '1.5': '0.375rem',
                  },
                },
              },
            },
          ),
        }
      },
    })

    expect(compiler.build(['my-width-1', 'my-width-1/2', 'my-width-1.5'])).toMatchInlineSnapshot(
      `
      ".my-width-1 {
        width: 0.25rem;
      }
      .my-width-1\\.5 {
        width: 0.375rem;
      }
      .my-width-1\\/2 {
        width: 60%;
      }
      "
    `,
    )
  })

  test('can use escaped CSS variables in theme values', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";

      @theme {
        --width-1: 0.25rem;
        /* Purposely setting to something different from the v3 default */
        --width-1\/2: 60%;
        --width-1\.5: 0.375rem;
        --width-2_5: 0.625rem;
      }
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
              { 'my-width': (value) => ({ width: value }) },
              { values: theme('width') },
            )
          }),
        }
      },
    })

    expect(compiler.build(['my-width-1', 'my-width-1.5', 'my-width-1/2', 'my-width-2.5']))
      .toMatchInlineSnapshot(`
        ".my-width-1 {
          width: 0.25rem;
        }
        .my-width-1\\.5 {
          width: 0.375rem;
        }
        .my-width-1\\/2 {
          width: 60%;
        }
        .my-width-2\\.5 {
          width: 0.625rem;
        }
        "
      `)
  })

  test('can use escaped CSS variables in referenced theme namespace', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "my-plugin";

      @theme {
        --width-1: 0.25rem;
        /* Purposely setting to something different from the v3 default */
        --width-1\/2: 60%;
        --width-1\.5: 0.375rem;
        --width-2_5: 0.625rem;
      }
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        return {
          base,
          module: plugin(
            function ({ matchUtilities, theme }) {
              matchUtilities(
                { 'my-width': (value) => ({ width: value }) },
                { values: theme('myWidth') },
              )
            },
            {
              theme: { myWidth: ({ theme }) => theme('width') },
            },
          ),
        }
      },
    })

    expect(compiler.build(['my-width-1', 'my-width-1.5', 'my-width-1/2', 'my-width-2.5']))
      .toMatchInlineSnapshot(`
        ".my-width-1 {
          width: 0.25rem;
        }
        .my-width-1\\.5 {
          width: 0.375rem;
        }
        .my-width-1\\/2 {
          width: 60%;
        }
        .my-width-2\\.5 {
          width: 0.625rem;
        }
        "
      `)
  })
})

describe('addBase', () => {
  test('does not create rules when imported via `@import "…" reference`', async () => {
    let input = css`
      @tailwind utilities;
      @plugin "outside";
      @import './inside.css' reference;
    `

    let compiler = await compile(input, {
      loadModule: async (id, base) => {
        if (id === 'inside') {
          return {
            base,
            module: plugin(function ({ addBase }) {
              addBase({ inside: { color: 'red' } })
            }),
          }
        }
        return {
          base,
          module: plugin(function ({ addBase }) {
            addBase({ outside: { color: 'red' } })
          }),
        }
      },
      async loadStylesheet() {
        return {
          content: css`
            @plugin "inside";
          `,
          base: '',
        }
      },
    })

    expect(compiler.build([])).toMatchInlineSnapshot(`
      "@layer base {
        outside {
          color: red;
        }
      }
      "
    `)
  })

  test('does not modify CSS variables', async () => {
    let input = css`
      @plugin "my-plugin";
    `

    let compiler = await compile(input, {
      loadModule: async () => ({
        module: plugin(function ({ addBase }) {
          addBase({
            ':root': {
              '--PascalCase': '1',
              '--camelCase': '1',
              '--UPPERCASE': '1',
            },
          })
        }),
        base: '/root',
      }),
    })

    expect(compiler.build([])).toMatchInlineSnapshot(`
      "@layer base {
        :root {
          --PascalCase: 1;
          --camelCase: 1;
          --UPPERCASE: 1;
        }
      }
      "
    `)
  })
})

describe('addVariant', () => {
  test('addVariant with string selector', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ addVariant }: PluginAPI) => {
              addVariant('hocus', '&:hover, &:focus')
            },
          }
        },
      },
    )
    let compiled = build(['hocus:underline', 'group-hocus:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .group-hocus\\:flex:is(:is(:where(.group):hover, :where(.group):focus) *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('addVariant with array of selectors', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ addVariant }: PluginAPI) => {
              addVariant('hocus', ['&:hover', '&:focus'])
            },
          }
        },
      },
    )

    let compiled = build(['hocus:underline', 'group-hocus:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .group-hocus\\:flex:is(:where(.group):hover *), .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('addVariant with object syntax and @slot', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ addVariant }: PluginAPI) => {
              addVariant('hocus', {
                '&:hover': '@slot',
                '&:focus': '@slot',
              })
            },
          }
        },
      },
    )
    let compiled = build(['hocus:underline', 'group-hocus:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .group-hocus\\:flex:is(:where(.group):hover *), .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('addVariant with object syntax, media, nesting and multiple @slot', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ addVariant }: PluginAPI) => {
              addVariant('hocus', {
                '@media (hover: hover)': {
                  '&:hover': '@slot',
                },
                '&:focus': '@slot',
              })
            },
          }
        },
      },
    )
    let compiled = build(['hocus:underline', 'group-hocus:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (hover: hover) {
          .group-hocus\\:flex:is(:where(.group):hover *) {
            display: flex;
          }
        }

        .group-hocus\\:flex:is(:where(.group):focus *) {
          display: flex;
        }

        @media (hover: hover) {
          .hocus\\:underline:hover {
            text-decoration-line: underline;
          }
        }

        .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('addVariant with at-rules and placeholder', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ addVariant }: PluginAPI) => {
              addVariant(
                'potato',
                '@media (max-width: 400px) { @supports (font:bold) { &:large-potato } }',
              )
            },
          }
        },
      },
    )
    let compiled = build(['potato:underline', 'potato:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (max-width: 400px) {
          @supports (font: bold) {
            .potato\\:flex:large-potato {
              display: flex;
            }

            .potato\\:underline:large-potato {
              text-decoration-line: underline;
            }
          }
        }
      }"
    `)
  })

  test('@slot is preserved when used as a custom property value', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ addVariant }: PluginAPI) => {
              addVariant('hocus', {
                '&': {
                  '--custom-property': '@slot',
                  '&:hover': '@slot',
                  '&:focus': '@slot',
                },
              })
            },
          }
        },
      },
    )
    let compiled = build(['hocus:underline'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .hocus\\:underline {
          --custom-property: @slot;
        }

        .hocus\\:underline:hover, .hocus\\:underline:focus {
          text-decoration-line: underline;
        }
      }"
    `)
  })
})

describe('matchVariant', () => {
  test('partial arbitrary variants', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('potato', (flavor) => `.potato-${flavor} &`)
            },
          }
        },
      },
    )
    let compiled = build(['potato-[yellow]:underline', 'potato-[baked]:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .potato-baked .potato-\\[baked\\]\\:flex {
          display: flex;
        }

        .potato-yellow .potato-\\[yellow\\]\\:underline {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('partial arbitrary variants with at-rules', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('potato', (flavor) => `@media (potato: ${flavor})`)
            },
          }
        },
      },
    )
    let compiled = build(['potato-[yellow]:underline', 'potato-[baked]:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (potato: baked) {
          .potato-\\[baked\\]\\:flex {
            display: flex;
          }
        }

        @media (potato: yellow) {
          .potato-\\[yellow\\]\\:underline {
            text-decoration-line: underline;
          }
        }
      }"
    `)
  })

  test('partial arbitrary variants with at-rules and placeholder', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant(
                'potato',
                (flavor) =>
                  `@media (potato: ${flavor}) { @supports (font:bold) { &:large-potato } }`,
              )
            },
          }
        },
      },
    )
    let compiled = build(['potato-[yellow]:underline', 'potato-[baked]:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (potato: baked) {
          @supports (font: bold) {
            .potato-\\[baked\\]\\:flex:large-potato {
              display: flex;
            }
          }
        }

        @media (potato: yellow) {
          @supports (font: bold) {
            .potato-\\[yellow\\]\\:underline:large-potato {
              text-decoration-line: underline;
            }
          }
        }
      }"
    `)
  })

  test('partial arbitrary variants with default values', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('tooltip', (side) => `&${side}`, {
                values: {
                  bottom: '[data-location="bottom"]',
                  top: '[data-location="top"]',
                },
              })
            },
          }
        },
      },
    )
    let compiled = build(['tooltip-bottom:underline', 'tooltip-top:flex'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .tooltip-bottom\\:underline[data-location="bottom"] {
          text-decoration-line: underline;
        }

        .tooltip-top\\:flex[data-location="top"] {
          display: flex;
        }
      }"
    `)
  })

  test('matched variant values maintain the sort order they are registered in', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('alphabet', (side) => `&${side}`, {
                values: {
                  d: '[data-order="1"]',
                  a: '[data-order="2"]',
                  c: '[data-order="3"]',
                  b: '[data-order="4"]',
                },
              })
            },
          }
        },
      },
    )
    let compiled = build([
      'alphabet-c:underline',
      'alphabet-a:underline',
      'alphabet-d:underline',
      'alphabet-b:underline',
    ])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .alphabet-d\\:underline[data-order="1"], .alphabet-a\\:underline[data-order="2"], .alphabet-c\\:underline[data-order="3"], .alphabet-b\\:underline[data-order="4"] {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('matchVariant can return an array of format strings from the function', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('test', (selector) =>
                selector.split(',').map((selector) => `&.${selector} > *`),
              )
            },
          }
        },
      },
    )
    let compiled = build(['test-[a,b,c]:underline'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .test-\\[a\\,b\\,c\\]\\:underline.a > *, .test-\\[a\\,b\\,c\\]\\:underline.b > *, .test-\\[a\\,b\\,c\\]\\:underline.c > * {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('should be possible to sort variants', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                sort(a, z) {
                  return parseInt(a.value) - parseInt(z.value)
                },
              })
            },
          }
        },
      },
    )
    let compiled = build([
      'testmin-[600px]:flex',
      'testmin-[500px]:underline',
      'testmin-[700px]:italic',
    ])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (min-width: 500px) {
          .testmin-\\[500px\\]\\:underline {
            text-decoration-line: underline;
          }
        }

        @media (min-width: 600px) {
          .testmin-\\[600px\\]\\:flex {
            display: flex;
          }
        }

        @media (min-width: 700px) {
          .testmin-\\[700px\\]\\:italic {
            font-style: italic;
          }
        }
      }"
    `)
  })

  test('should be possible to compare arbitrary variants and hardcoded variants', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                values: {
                  example: '600px',
                },
                sort(a, z) {
                  return parseInt(a.value) - parseInt(z.value)
                },
              })
            },
          }
        },
      },
    )
    let compiled = build([
      'testmin-[700px]:italic',
      'testmin-example:italic',
      'testmin-[500px]:italic',
    ])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (min-width: 500px) {
          .testmin-\\[500px\\]\\:italic {
            font-style: italic;
          }
        }

        @media (min-width: 600px) {
          .testmin-example\\:italic {
            font-style: italic;
          }
        }

        @media (min-width: 700px) {
          .testmin-\\[700px\\]\\:italic {
            font-style: italic;
          }
        }
      }"
    `)
  })

  test('should be possible to sort stacked arbitrary variants correctly', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                sort(a, z) {
                  return parseInt(a.value) - parseInt(z.value)
                },
              })

              matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                sort(a, z) {
                  return parseInt(z.value) - parseInt(a.value)
                },
              })
            },
          }
        },
      },
    )

    let compiled = build([
      'testmin-[150px]:testmax-[400px]:order-2',
      'testmin-[100px]:testmax-[350px]:order-3',
      'testmin-[100px]:testmax-[300px]:order-4',
      'testmin-[100px]:testmax-[400px]:order-1',
    ])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (min-width: 100px) {
          @media (max-width: 400px) {
            .testmin-\\[100px\\]\\:testmax-\\[400px\\]\\:order-1 {
              order: 1;
            }
          }
        }

        @media (min-width: 150px) {
          @media (max-width: 400px) {
            .testmin-\\[150px\\]\\:testmax-\\[400px\\]\\:order-2 {
              order: 2;
            }
          }
        }

        @media (min-width: 100px) {
          @media (max-width: 350px) {
            .testmin-\\[100px\\]\\:testmax-\\[350px\\]\\:order-3 {
              order: 3;
            }
          }

          @media (max-width: 300px) {
            .testmin-\\[100px\\]\\:testmax-\\[300px\\]\\:order-4 {
              order: 4;
            }
          }
        }
      }"
    `)
  })

  test('should maintain sort from other variants, if sort functions of arbitrary variants return 0', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                sort(a, z) {
                  return parseInt(a.value) - parseInt(z.value)
                },
              })

              matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                sort(a, z) {
                  return parseInt(z.value) - parseInt(a.value)
                },
              })
            },
          }
        },
      },
    )
    let compiled = build([
      'testmin-[100px]:testmax-[200px]:focus:underline',
      'testmin-[100px]:testmax-[200px]:hover:underline',
    ])

    // Expect :focus to come after :hover
    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (min-width: 100px) {
          @media (max-width: 200px) {
            @media (hover: hover) {
              .testmin-\\[100px\\]\\:testmax-\\[200px\\]\\:hover\\:underline:hover {
                text-decoration-line: underline;
              }
            }

            .testmin-\\[100px\\]\\:testmax-\\[200px\\]\\:focus\\:underline:focus {
              text-decoration-line: underline;
            }
          }
        }
      }"
    `)
  })

  test('should sort arbitrary variants left to right (1)', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                sort(a, z) {
                  return parseInt(a.value) - parseInt(z.value)
                },
              })
              matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                sort(a, z) {
                  return parseInt(z.value) - parseInt(a.value)
                },
              })
            },
          }
        },
      },
    )
    let compiled = build([
      'testmin-[200px]:testmax-[400px]:order-2',
      'testmin-[200px]:testmax-[300px]:order-4',
      'testmin-[100px]:testmax-[400px]:order-1',
      'testmin-[100px]:testmax-[300px]:order-3',
    ])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (min-width: 100px) {
          @media (max-width: 400px) {
            .testmin-\\[100px\\]\\:testmax-\\[400px\\]\\:order-1 {
              order: 1;
            }
          }
        }

        @media (min-width: 200px) {
          @media (max-width: 400px) {
            .testmin-\\[200px\\]\\:testmax-\\[400px\\]\\:order-2 {
              order: 2;
            }
          }
        }

        @media (min-width: 100px) {
          @media (max-width: 300px) {
            .testmin-\\[100px\\]\\:testmax-\\[300px\\]\\:order-3 {
              order: 3;
            }
          }
        }

        @media (min-width: 200px) {
          @media (max-width: 300px) {
            .testmin-\\[200px\\]\\:testmax-\\[300px\\]\\:order-4 {
              order: 4;
            }
          }
        }
      }"
    `)
  })

  test('should sort arbitrary variants left to right (2)', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                sort(a, z) {
                  return parseInt(a.value) - parseInt(z.value)
                },
              })
              matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                sort(a, z) {
                  return parseInt(z.value) - parseInt(a.value)
                },
              })
            },
          }
        },
      },
    )
    let compiled = build([
      'testmax-[400px]:testmin-[200px]:underline',
      'testmax-[300px]:testmin-[200px]:underline',
      'testmax-[400px]:testmin-[100px]:underline',
      'testmax-[300px]:testmin-[100px]:underline',
    ])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (max-width: 400px) {
          @media (min-width: 100px) {
            .testmax-\\[400px\\]\\:testmin-\\[100px\\]\\:underline {
              text-decoration-line: underline;
            }
          }

          @media (min-width: 200px) {
            .testmax-\\[400px\\]\\:testmin-\\[200px\\]\\:underline {
              text-decoration-line: underline;
            }
          }
        }

        @media (max-width: 300px) {
          @media (min-width: 100px) {
            .testmax-\\[300px\\]\\:testmin-\\[100px\\]\\:underline {
              text-decoration-line: underline;
            }
          }

          @media (min-width: 200px) {
            .testmax-\\[300px\\]\\:testmin-\\[200px\\]\\:underline {
              text-decoration-line: underline;
            }
          }
        }
      }"
    `)
  })

  test('should guarantee that we are not passing values from other variants to the wrong function', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('testmin', (value) => `@media (min-width: ${value})`, {
                sort(a, z) {
                  let lookup = ['100px', '200px']
                  if (lookup.indexOf(a.value) === -1 || lookup.indexOf(z.value) === -1) {
                    throw new Error('We are seeing values that should not be there!')
                  }
                  return lookup.indexOf(a.value) - lookup.indexOf(z.value)
                },
              })
              matchVariant('testmax', (value) => `@media (max-width: ${value})`, {
                sort(a, z) {
                  let lookup = ['300px', '400px']
                  if (lookup.indexOf(a.value) === -1 || lookup.indexOf(z.value) === -1) {
                    throw new Error('We are seeing values that should not be there!')
                  }
                  return lookup.indexOf(z.value) - lookup.indexOf(a.value)
                },
              })
            },
          }
        },
      },
    )
    let compiled = build([
      'testmin-[200px]:testmax-[400px]:order-2',
      'testmin-[200px]:testmax-[300px]:order-4',
      'testmin-[100px]:testmax-[400px]:order-1',
      'testmin-[100px]:testmax-[300px]:order-3',
    ])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        @media (min-width: 100px) {
          @media (max-width: 400px) {
            .testmin-\\[100px\\]\\:testmax-\\[400px\\]\\:order-1 {
              order: 1;
            }
          }
        }

        @media (min-width: 200px) {
          @media (max-width: 400px) {
            .testmin-\\[200px\\]\\:testmax-\\[400px\\]\\:order-2 {
              order: 2;
            }
          }
        }

        @media (min-width: 100px) {
          @media (max-width: 300px) {
            .testmin-\\[100px\\]\\:testmax-\\[300px\\]\\:order-3 {
              order: 3;
            }
          }
        }

        @media (min-width: 200px) {
          @media (max-width: 300px) {
            .testmin-\\[200px\\]\\:testmax-\\[300px\\]\\:order-4 {
              order: 4;
            }
          }
        }
      }"
    `)
  })

  test('should default to the DEFAULT value for variants', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('foo', (value) => `.foo${value} &`, {
                values: {
                  DEFAULT: '.bar',
                },
              })
            },
          }
        },
      },
    )
    let compiled = build(['foo:underline'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .foo.bar .foo\\:underline {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('should not generate anything if the matchVariant does not have a DEFAULT value configured', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('foo', (value) => `.foo${value} &`)
            },
          }
        },
      },
    )
    let compiled = build(['foo:underline'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`"@layer utilities;"`)
  })

  test('should be possible to use `null` as a DEFAULT value', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('foo', (value) => `.foo${value === null ? '-good' : '-bad'} &`, {
                values: { DEFAULT: null },
              })
            },
          }
        },
      },
    )
    let compiled = build(['foo:underline'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .foo-good .foo\\:underline {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('should be possible to use `undefined` as a DEFAULT value', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('foo', (value) => `.foo${value === undefined ? '-good' : '-bad'} &`, {
                values: { DEFAULT: undefined },
              })
            },
          }
        },
      },
    )
    let compiled = build(['foo:underline'])

    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .foo-good .foo\\:underline {
          text-decoration-line: underline;
        }
      }"
    `)
  })

  test('should be called with eventual modifiers', async () => {
    let { build } = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        loadModule: async (id, base) => {
          return {
            base,
            module: ({ matchVariant }: PluginAPI) => {
              matchVariant('my-container', (value, { modifier }) => {
                function parseValue(value: string) {
                  const numericValue = value.match(/^(\d+\.\d+|\d+|\.\d+)\D+/)?.[1] ?? null
                  if (numericValue === null) return null

                  return parseFloat(value)
                }

                const parsed = parseValue(value)
                return parsed !== null ? `@container ${modifier ?? ''} (min-width: ${value})` : []
              })
            },
          }
        },
      },
    )
    let compiled = build([
      'my-container-[250px]:underline',
      'my-container-[250px]/placement:underline',
    ])
    expect(optimizeCss(compiled).trim()).toMatchInlineSnapshot(`
      "@container (min-width: 250px) {
        .my-container-\\[250px\\]\\:underline {
          text-decoration-line: underline;
        }
      }

      @container placement (min-width: 250px) {
        .my-container-\\[250px\\]\\/placement\\:underline {
          text-decoration-line: underline;
        }
      }"
    `)
  })
})

describe('addUtilities()', () => {
  test('custom static utility', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.text-trim': {
                  'text-box-trim': 'both',
                  'text-box-edge': 'cap alphabetic',
                },
              })
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['text-trim', 'lg:text-trim'])).trim())
      .toMatchInlineSnapshot(`
        "@layer utilities {
          .text-trim {
            text-box-trim: both;
            text-box-edge: cap alphabetic;
          }

          @media (min-width: 1024px) {
            .lg\\:text-trim {
              text-box-trim: both;
              text-box-edge: cap alphabetic;
            }
          }
        }"
      `)
  })

  test('return multiple rule objects from a custom utility', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities([
                {
                  '.text-trim': [
                    { 'text-box-trim': 'both' },
                    { 'text-box-edge': 'cap alphabetic' },
                  ],
                },
              ])
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['text-trim'])).trim()).toMatchInlineSnapshot(`
      ".text-trim {
        text-box-trim: both;
        text-box-edge: cap alphabetic;
      }"
    `)
  })

  test('define multiple utilities with array syntax', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities([
                {
                  '.text-trim': {
                    'text-box-trim': 'both',
                    'text-box-edge': 'cap alphabetic',
                  },
                },
                {
                  '.text-trim-2': {
                    'text-box-trim': 'both',
                    'text-box-edge': 'cap alphabetic',
                  },
                },
              ])
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['text-trim', 'text-trim-2'])).trim()).toMatchInlineSnapshot(`
      ".text-trim, .text-trim-2 {
        text-box-trim: both;
        text-box-edge: cap alphabetic;
      }"
    `)
  })

  test('utilities can use arrays for fallback declaration values', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities([
                {
                  '.outlined': {
                    outline: ['1px solid ButtonText', '1px auto -webkit-focus-ring-color'],
                  },
                },
              ])
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['outlined'])).trim()).toMatchInlineSnapshot(`
      ".outlined {
        outline: 1px solid buttontext;
        outline: 1px auto -webkit-focus-ring-color;
      }"
    `)
  })

  test('camel case properties are converted to kebab-case', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.text-trim': {
                  WebkitAppearance: 'none',
                  textBoxTrim: 'both',
                  textBoxEdge: 'cap alphabetic',
                },
              })
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['text-trim'])).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .text-trim {
          -webkit-appearance: none;
          text-box-trim: both;
          text-box-edge: cap alphabetic;
        }
      }"
    `)
  })

  test('custom static utilities support `@apply`', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.foo': {
                  '@apply flex dark:underline': {},
                },
              })
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['foo', 'lg:foo'])).trim()).toMatchInlineSnapshot(`
      "@layer utilities {
        .foo {
          display: flex;
        }

        @media (prefers-color-scheme: dark) {
          .foo {
            text-decoration-line: underline;
          }
        }

        @media (min-width: 1024px) {
          .lg\\:foo {
            display: flex;
          }

          @media (prefers-color-scheme: dark) {
            .lg\\:foo {
              text-decoration-line: underline;
            }
          }
        }
      }"
    `)
  })

  test('throws on custom static utilities with an invalid name', async () => {
    await expect(() => {
      return compile(
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,
        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ addUtilities }: PluginAPI) => {
                addUtilities({
                  ':hover > *': {
                    'text-box-trim': 'both',
                    'text-box-edge': 'cap alphabetic',
                  },
                })
              },
            }
          },
        },
      )
    }).rejects.toThrowError(/invalid utility selector/)
  })

  test('supports multiple selector names', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.form-input, .form-textarea': {
                  appearance: 'none',
                  'background-color': '#fff',
                },
              })
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['form-input', 'lg:form-textarea'])).trim())
      .toMatchInlineSnapshot(`
        ".form-input {
          appearance: none;
          background-color: #fff;
        }

        @media (min-width: 1024px) {
          .lg\\:form-textarea {
            appearance: none;
            background-color: #fff;
          }
        }"
      `)
  })

  test('supports pseudo classes and pseudo elements', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.form-input, .form-input::placeholder, .form-textarea:hover:focus': {
                  'background-color': 'red',
                },
              })
            },
          }
        },
      },
    )

    expect(compiled.build(['form-input', 'lg:form-textarea']).trim()).toMatchInlineSnapshot(`
      ".form-input {
        background-color: red;
        &::placeholder {
          background-color: red;
        }
      }
      .lg\\:form-textarea {
        @media (width >= 1024px) {
          &:hover:focus {
            background-color: red;
          }
        }
      }"
    `)
  })

  test('nests complex utility names', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.a .b:hover .c': {
                  color: 'red',
                },
                '.d > *': {
                  color: 'red',
                },
                '.e .bar:not(.f):has(.g)': {
                  color: 'red',
                },
                '.h~.i': {
                  color: 'red',
                },
                '.j.j': {
                  color: 'red',
                },
              })
            },
          }
        },
      },
    )

    expect(
      compiled.build(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']).trim(),
    ).toMatchInlineSnapshot(
      `
      "@layer utilities {
        .j {
          &.j {
            color: red;
          }
          .j& {
            color: red;
          }
        }
        .a {
          & .b:hover .c {
            color: red;
          }
        }
        .b {
          .a &:hover .c {
            color: red;
          }
        }
        .c {
          .a .b:hover & {
            color: red;
          }
        }
        .d {
          & > * {
            color: red;
          }
        }
        .e {
          & .bar:not(.f):has(.g) {
            color: red;
          }
        }
        .g {
          .e .bar:not(.f):has(&) {
            color: red;
          }
        }
        .h {
          &~.i {
            color: red;
          }
        }
        .i {
          .h~& {
            color: red;
          }
        }
      }"
    `,
    )
  })

  test('prefixes nested class names with the configured theme prefix', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }
        @theme prefix(tw) {
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.a .b:hover .c.d': {
                  color: 'red',
                },
              })
            },
          }
        },
      },
    )

    expect(compiled.build(['tw:a', 'tw:b', 'tw:c', 'tw:d']).trim()).toMatchInlineSnapshot(
      `
      "@layer utilities {
        .tw\\:a {
          & .tw\\:b:hover .tw\\:c.tw\\:d {
            color: red;
          }
        }
        .tw\\:b {
          .tw\\:a &:hover .tw\\:c.tw\\:d {
            color: red;
          }
        }
        .tw\\:c {
          .tw\\:a .tw\\:b:hover &.tw\\:d {
            color: red;
          }
        }
        .tw\\:d {
          .tw\\:a .tw\\:b:hover .tw\\:c& {
            color: red;
          }
        }
      }"
    `,
    )
  })

  test('replaces the class name with variants in nested selectors', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @theme {
          --breakpoint-md: 768px;
        }
        @tailwind utilities;
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addUtilities }: PluginAPI) => {
              addUtilities({
                '.foo': {
                  ':where(.foo > :first-child)': {
                    color: 'red',
                  },
                },
              })
            },
          }
        },
      },
    )

    expect(compiled.build(['foo', 'md:foo', 'not-hover:md:foo']).trim()).toMatchInlineSnapshot(`
      ".foo {
        :where(.foo > :first-child) {
          color: red;
        }
      }
      .md\\:foo {
        @media (width >= 768px) {
          :where(.md\\:foo > :first-child) {
            color: red;
          }
        }
      }
      .not-hover\\:md\\:foo {
        &:not(*:hover) {
          @media (width >= 768px) {
            :where(.not-hover\\:md\\:foo > :first-child) {
              color: red;
            }
          }
        }
        @media not (hover: hover) {
          @media (width >= 768px) {
            :where(.not-hover\\:md\\:foo > :first-child) {
              color: red;
            }
          }
        }
      }"
    `)
  })
})

describe('matchUtilities()', () => {
  test('custom functional utility', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,

        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    'border-block': (value) => ({ 'border-block-width': value }),
                  },
                  {
                    values: {
                      DEFAULT: '1px',
                      '2': '2px',
                    },
                  },
                )
              },
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run([
          'border-block',
          'border-block-2',
          'border-block-[35px]',
          'border-block-[var(--foo)]',
          'lg:border-block-2',
        ]),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".border-block {
        border-block-width: 1px;
      }

      .border-block-2 {
        border-block-width: 2px;
      }

      .border-block-\\[35px\\] {
        border-block-width: 35px;
      }

      .border-block-\\[var\\(--foo\\)\\] {
        border-block-width: var(--foo);
      }

      @media (min-width: 1024px) {
        .lg\\:border-block-2 {
          border-block-width: 2px;
        }
      }"
    `)

    expect(
      optimizeCss(
        await run([
          '-border-block',
          '-border-block-2',
          'lg:-border-block-2',
          'border-block-unknown',
          'border-block/1',
        ]),
      ).trim(),
    ).toEqual('')
  })

  test('custom functional utilities can start with @', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";
          @tailwind utilities;
        `,

        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  { '@w': (value) => ({ width: value }) },
                  {
                    values: {
                      1: '1px',
                    },
                  },
                )
              },
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(optimizeCss(await run(['@w-1', 'hover:@w-1'])).trim()).toMatchInlineSnapshot(`
      ".\\@w-1 {
        width: 1px;
      }

      @media (hover: hover) {
        .hover\\:\\@w-1:hover {
          width: 1px;
        }
      }"
    `)
  })

  test('custom functional utilities can return an array of rules', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  'all-but-order-bottom-left-radius': (value) =>
                    [
                      { 'border-top-left-radius': value },
                      { 'border-top-right-radius': value },
                      { 'border-bottom-right-radius': value },
                    ] as CssInJs[],
                },
                {
                  values: {
                    DEFAULT: '1px',
                  },
                },
              )
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['all-but-order-bottom-left-radius'])).trim())
      .toMatchInlineSnapshot(`
        ".all-but-order-bottom-left-radius {
          border-top-left-radius: 1px;
          border-top-right-radius: 1px;
          border-bottom-right-radius: 1px;
        }"
      `)
  })

  test('custom functional utility with any modifier', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,

        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    'border-block': (value, { modifier }) => ({
                      '--my-modifier': modifier ?? 'none',
                      'border-block-width': value,
                    }),
                  },
                  {
                    values: {
                      DEFAULT: '1px',
                      '2': '2px',
                    },

                    modifiers: 'any',
                  },
                )
              },
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run(['border-block', 'border-block-2', 'border-block/foo', 'border-block-2/foo']),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".border-block {
        --my-modifier: none;
        border-block-width: 1px;
      }

      .border-block-2 {
        --my-modifier: none;
        border-block-width: 2px;
      }

      .border-block-2\\/foo {
        --my-modifier: foo;
        border-block-width: 2px;
      }

      .border-block\\/foo {
        --my-modifier: foo;
        border-block-width: 1px;
      }"
    `)
  })

  test('custom functional utility with known modifier', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,

        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    'border-block': (value, { modifier }) => ({
                      '--my-modifier': modifier ?? 'none',
                      'border-block-width': value,
                    }),
                  },
                  {
                    values: {
                      DEFAULT: '1px',
                      '2': '2px',
                    },

                    modifiers: {
                      foo: 'foo',
                    },
                  },
                )
              },
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run(['border-block', 'border-block-2', 'border-block/foo', 'border-block-2/foo']),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".border-block {
        --my-modifier: none;
        border-block-width: 1px;
      }

      .border-block-2 {
        --my-modifier: none;
        border-block-width: 2px;
      }

      .border-block-2\\/foo {
        --my-modifier: foo;
        border-block-width: 2px;
      }

      .border-block\\/foo {
        --my-modifier: foo;
        border-block-width: 1px;
      }"
    `)

    expect(
      optimizeCss(await run(['border-block/unknown', 'border-block-2/unknown'])).trim(),
    ).toEqual('')
  })

  // We're not married to this behavior — if there's a good reason to do this differently in the
  // future don't be afraid to change what should happen in this scenario.
  describe('plugins that handle a specific arbitrary value type prevent falling through to other plugins if the result is invalid for that plugin', () => {
    test('implicit color modifier', async () => {
      async function run(candidates: string[]) {
        let compiled = await compile(
          css`
            @tailwind utilities;
            @plugin "my-plugin";
          `,

          {
            async loadModule(id, base) {
              return {
                base,
                module: ({ matchUtilities }: PluginAPI) => {
                  matchUtilities(
                    {
                      scrollbar: (value) => ({ 'scrollbar-color': value }),
                    },
                    { type: ['color', 'any'] },
                  )

                  matchUtilities(
                    {
                      scrollbar: (value) => ({ 'scrollbar-width': value }),
                    },
                    { type: ['length'] },
                  )
                },
              }
            },
          },
        )

        return compiled.build(candidates)
      }

      expect(
        optimizeCss(
          await run(['scrollbar-[2px]', 'scrollbar-[#08c]', 'scrollbar-[#08c]/50']),
        ).trim(),
      ).toMatchInlineSnapshot(`
        ".scrollbar-\\[\\#08c\\] {
          scrollbar-color: #08c;
        }

        .scrollbar-\\[\\#08c\\]\\/50 {
          scrollbar-color: oklab(59.9824% -.067 -.124 / .5);
        }

        .scrollbar-\\[2px\\] {
          scrollbar-width: 2px;
        }"
      `)
      expect(optimizeCss(await run(['scrollbar-[2px]/50'])).trim()).toEqual('')
    })

    test('no modifiers are supported by the plugins', async () => {
      async function run(candidates: string[]) {
        let compiled = await compile(
          css`
            @tailwind utilities;
            @plugin "my-plugin";
          `,

          {
            async loadModule(id, base) {
              return {
                base,
                module: ({ matchUtilities }: PluginAPI) => {
                  matchUtilities(
                    {
                      scrollbar: (value) => ({ '--scrollbar-angle': value }),
                    },
                    { type: ['angle', 'any'] },
                  )

                  matchUtilities(
                    {
                      scrollbar: (value) => ({ '--scrollbar-width': value }),
                    },
                    { type: ['length'] },
                  )
                },
              }
            },
          },
        )

        return compiled.build(candidates)
      }

      expect(optimizeCss(await run(['scrollbar-[2px]/50'])).trim()).toEqual('')
    })

    test('invalid named modifier', async () => {
      async function run(candidates: string[]) {
        let compiled = await compile(
          css`
            @tailwind utilities;
            @plugin "my-plugin";
          `,

          {
            async loadModule(id, base) {
              return {
                base,
                module: ({ matchUtilities }: PluginAPI) => {
                  matchUtilities(
                    {
                      scrollbar: (value) => ({ 'scrollbar-color': value }),
                    },
                    { type: ['color', 'any'], modifiers: { foo: 'foo' } },
                  )

                  matchUtilities(
                    {
                      scrollbar: (value) => ({ 'scrollbar-width': value }),
                    },
                    { type: ['length'], modifiers: { bar: 'bar' } },
                  )
                },
              }
            },
          },
        )

        return compiled.build(candidates)
      }

      expect(optimizeCss(await run(['scrollbar-[2px]/foo'])).trim()).toEqual('')
    })
  })

  test('custom functional utilities with different types', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,

        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    scrollbar: (value) => ({ 'scrollbar-color': value }),
                  },
                  {
                    type: ['color', 'any'],
                    values: {
                      black: 'black',
                    },
                  },
                )

                matchUtilities(
                  {
                    scrollbar: (value) => ({ 'scrollbar-width': value }),
                  },
                  {
                    type: ['length'],
                    values: {
                      2: '2px',
                    },
                  },
                )
              },
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run([
          'scrollbar-black',
          'scrollbar-black/50',
          'scrollbar-2',
          'scrollbar-[#fff]',
          'scrollbar-[#fff]/50',
          'scrollbar-[2px]',
          'scrollbar-[var(--my-color)]',
          'scrollbar-[var(--my-color)]/50',
          'scrollbar-[color:var(--my-color)]',
          'scrollbar-[color:var(--my-color)]/50',
          'scrollbar-[length:var(--my-width)]',
        ]),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".scrollbar-2 {
        scrollbar-width: 2px;
      }

      .scrollbar-\\[\\#fff\\] {
        scrollbar-color: #fff;
      }

      .scrollbar-\\[\\#fff\\]\\/50 {
        scrollbar-color: oklab(100% 0 5.96046e-8 / .5);
      }

      .scrollbar-\\[2px\\] {
        scrollbar-width: 2px;
      }

      .scrollbar-\\[color\\:var\\(--my-color\\)\\], .scrollbar-\\[color\\:var\\(--my-color\\)\\]\\/50 {
        scrollbar-color: var(--my-color);
      }

      @supports (color: color-mix(in lab, red, red)) {
        .scrollbar-\\[color\\:var\\(--my-color\\)\\]\\/50 {
          scrollbar-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        }
      }

      .scrollbar-\\[length\\:var\\(--my-width\\)\\] {
        scrollbar-width: var(--my-width);
      }

      .scrollbar-\\[var\\(--my-color\\)\\], .scrollbar-\\[var\\(--my-color\\)\\]\\/50 {
        scrollbar-color: var(--my-color);
      }

      @supports (color: color-mix(in lab, red, red)) {
        .scrollbar-\\[var\\(--my-color\\)\\]\\/50 {
          scrollbar-color: color-mix(in oklab, var(--my-color) 50%, transparent);
        }
      }

      .scrollbar-black {
        scrollbar-color: black;
      }

      .scrollbar-black\\/50 {
        scrollbar-color: oklab(0% none none / .5);
      }"
    `)

    expect(
      optimizeCss(
        await run([
          'scrollbar-2/50',
          'scrollbar-[2px]/50',
          'scrollbar-[length:var(--my-width)]/50',
        ]),
      ).trim(),
    ).toEqual('')
  })

  test('functional utilities with `type: color` automatically support opacity', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,

        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    scrollbar: (value) => ({ 'scrollbar-color': value }),
                  },
                  {
                    type: ['color', 'any'],
                    values: {
                      black: 'black',
                    },
                  },
                )
              },
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run([
          'scrollbar-current',
          'scrollbar-current/45',
          'scrollbar-black',
          'scrollbar-black/33',
          'scrollbar-black/[50%]',
          'scrollbar-[var(--my-color)]/[25%]',
        ]),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".scrollbar-\\[var\\(--my-color\\)\\]\\/\\[25\\%\\] {
        scrollbar-color: var(--my-color);
      }

      @supports (color: color-mix(in lab, red, red)) {
        .scrollbar-\\[var\\(--my-color\\)\\]\\/\\[25\\%\\] {
          scrollbar-color: color-mix(in oklab, var(--my-color) 25%, transparent);
        }
      }

      .scrollbar-black {
        scrollbar-color: black;
      }

      .scrollbar-black\\/33 {
        scrollbar-color: oklab(0% none none / .33);
      }

      .scrollbar-black\\/\\[50\\%\\] {
        scrollbar-color: oklab(0% none none / .5);
      }

      .scrollbar-current, .scrollbar-current\\/45 {
        scrollbar-color: currentcolor;
      }

      @supports (color: color-mix(in lab, red, red)) {
        .scrollbar-current\\/45 {
          scrollbar-color: color-mix(in oklab, currentcolor 45%, transparent);
        }
      }"
    `)
  })

  test('functional utilities with explicit modifiers', async () => {
    async function run(candidates: string[]) {
      let compiled = await compile(
        css`
          @plugin "my-plugin";

          @tailwind utilities;

          @theme reference {
            --breakpoint-lg: 1024px;
            --opacity-my-opacity: 0.5;
          }
        `,

        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities(
                  {
                    scrollbar: (value, { modifier }) => ({
                      '--modifier': modifier ?? 'none',
                      'scrollbar-width': value,
                    }),
                  },
                  {
                    type: ['any'],
                    values: {},
                    modifiers: {
                      foo: 'foo',
                    },
                  },
                )
              },
            }
          },
        },
      )

      return compiled.build(candidates)
    }

    expect(
      optimizeCss(
        await run(['scrollbar-[12px]', 'scrollbar-[12px]/foo', 'scrollbar-[12px]/bar']),
      ).trim(),
    ).toMatchInlineSnapshot(`
      ".scrollbar-\\[12px\\] {
        --modifier: none;
        scrollbar-width: 12px;
      }

      .scrollbar-\\[12px\\]\\/foo {
        --modifier: foo;
        scrollbar-width: 12px;
      }"
    `)
  })

  test('functional utilities support `@apply`', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @layer utilities {
          @tailwind utilities;
        }

        @theme reference {
          --breakpoint-lg: 1024px;
        }
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  foo: (value) => ({
                    '--foo': value,
                    [`@apply flex`]: {},
                  }),
                },
                {
                  values: {
                    bar: 'bar',
                  },
                },
              )
            },
          }
        },
      },
    )

    expect(
      optimizeCss(compiled.build(['foo-bar', 'lg:foo-bar', 'foo-[12px]', 'lg:foo-[12px]'])).trim(),
    ).toMatchInlineSnapshot(`
      "@layer utilities {
        .foo-\\[12px\\] {
          --foo: 12px;
          display: flex;
        }

        .foo-bar {
          --foo: bar;
          display: flex;
        }

        @media (min-width: 1024px) {
          .lg\\:foo-\\[12px\\] {
            --foo: 12px;
            display: flex;
          }

          .lg\\:foo-bar {
            --foo: bar;
            display: flex;
          }
        }
      }"
    `)
  })

  test('throws on custom utilities with an invalid name', async () => {
    await expect(() => {
      return compile(
        css`
          @plugin "my-plugin";
          @layer utilities {
            @tailwind utilities;
          }

          @theme reference {
            --breakpoint-lg: 1024px;
          }
        `,

        {
          async loadModule(id, base) {
            return {
              base,
              module: ({ matchUtilities }: PluginAPI) => {
                matchUtilities({
                  '.text-trim > *': () => ({
                    'text-box-trim': 'both',
                    'text-box-edge': 'cap alphabetic',
                  }),
                })
              },
            }
          },
        },
      )
    }).rejects.toThrowError(/invalid utility name/)
  })

  test('replaces the class name with variants in nested selectors', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @theme {
          --breakpoint-md: 768px;
        }
        @tailwind utilities;
      `,
      {
        async loadModule(base) {
          return {
            base,
            module: ({ matchUtilities }: PluginAPI) => {
              matchUtilities(
                {
                  foo: (value) => ({
                    ':where(.foo > :first-child)': {
                      color: value,
                    },
                  }),
                },
                {
                  values: {
                    red: 'red',
                  },
                },
              )
            },
          }
        },
      },
    )

    expect(compiled.build(['foo-red', 'md:foo-red', 'not-hover:md:foo-red']).trim())
      .toMatchInlineSnapshot(`
        ".foo-red {
          :where(.foo-red > :first-child) {
            color: red;
          }
        }
        .md\\:foo-red {
          @media (width >= 768px) {
            :where(.md\\:foo-red > :first-child) {
              color: red;
            }
          }
        }
        .not-hover\\:md\\:foo-red {
          &:not(*:hover) {
            @media (width >= 768px) {
              :where(.not-hover\\:md\\:foo-red > :first-child) {
                color: red;
              }
            }
          }
          @media not (hover: hover) {
            @media (width >= 768px) {
              :where(.not-hover\\:md\\:foo-red > :first-child) {
                color: red;
              }
            }
          }
        }"
      `)
  })
})

describe('addComponents()', () => {
  test('is an alias for addUtilities', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ addComponents }: PluginAPI) => {
              addComponents({
                '.btn': {
                  padding: '.5rem 1rem',
                  borderRadius: '.25rem',
                  fontWeight: '600',
                },
                '.btn-blue': {
                  backgroundColor: '#3490dc',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#2779bd',
                  },
                },
                '.btn-red': {
                  backgroundColor: '#e3342f',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#cc1f1a',
                  },
                },
              })
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['btn', 'btn-blue', 'btn-red'])).trim())
      .toMatchInlineSnapshot(`
        ".btn {
          border-radius: .25rem;
          padding: .5rem 1rem;
          font-weight: 600;
        }

        .btn-blue {
          color: #fff;
          background-color: #3490dc;
        }

        .btn-blue:hover {
          background-color: #2779bd;
        }

        .btn-red {
          color: #fff;
          background-color: #e3342f;
        }

        .btn-red:hover {
          background-color: #cc1f1a;
        }"
      `)
  })
})

describe('matchComponents()', () => {
  test('is an alias for matchUtilities', async () => {
    let compiled = await compile(
      css`
        @plugin "my-plugin";
        @tailwind utilities;
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ matchComponents }: PluginAPI) => {
              matchComponents(
                {
                  prose: (value) => ({ '--container-size': value }),
                },
                {
                  values: {
                    DEFAULT: 'normal',
                    sm: 'sm',
                    lg: 'lg',
                  },
                },
              )
            },
          }
        },
      },
    )

    expect(optimizeCss(compiled.build(['prose', 'sm:prose-sm', 'hover:prose-lg'])).trim())
      .toMatchInlineSnapshot(`
        ".prose {
          --container-size: normal;
        }

        @media (hover: hover) {
          .hover\\:prose-lg:hover {
            --container-size: lg;
          }
        }"
      `)
  })
})

describe('prefix()', () => {
  test('is an identity function', async () => {
    let fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ prefix }: PluginAPI) => {
              fn(prefix('btn'))
            },
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith('btn')
  })
})

describe('config()', () => {
  test('can return the resolved config when passed no arguments', async () => {
    let fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ config }: PluginAPI) => {
              fn(config())
            },
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: expect.objectContaining({
          spacing: expect.any(Object),
        }),
      }),
    )
  })

  test('can return part of the config', async () => {
    let fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ config }: PluginAPI) => {
              fn(config('theme'))
            },
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith(
      expect.objectContaining({
        spacing: expect.any(Object),
      }),
    )
  })

  test('falls back to default value if requested path does not exist', async () => {
    let fn = vi.fn()
    await compile(
      css`
        @plugin "my-plugin";
      `,
      {
        async loadModule(id, base) {
          return {
            base,
            module: ({ config }: PluginAPI) => {
              fn(config('somekey', 'defaultvalue'))
            },
          }
        },
      },
    )

    expect(fn).toHaveBeenCalledWith('defaultvalue')
  })
})
