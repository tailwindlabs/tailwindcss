import { describe, expect, test, vi } from 'vitest'
import { run } from '../test-utils/run'

const css = String.raw

describe('darkModePlugin', () => {
  // -------------------------------------------------------------------------
  // Smoke tests for already-covered paths
  // -------------------------------------------------------------------------

  test('darkMode: "media" — uses prefers-color-scheme media query', async () => {
    expect(
      await run(
        ['dark:underline'],
        css`
          @tailwind utilities;
          @config "./config.js";
        `,
        {
          loadModule: async () => ({ module: { darkMode: 'media' }, base: '/root', path: '' }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      @media (prefers-color-scheme: dark) {
        .dark\\:underline {
          text-decoration-line: underline;
        }
      }
      "
    `)
  })

  test('darkMode: "selector" — uses :where() selector', async () => {
    expect(
      await run(
        ['dark:underline'],
        css`
          @tailwind utilities;
          @config "./config.js";
        `,
        {
          loadModule: async () => ({ module: { darkMode: 'selector' }, base: '/root', path: '' }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .dark\\:underline:where(.dark, .dark *) {
        text-decoration-line: underline;
      }
      "
    `)
  })

  // -------------------------------------------------------------------------
  // Previously-uncovered: darkMode: "class" (legacy v3 behavior)
  // -------------------------------------------------------------------------

  test('darkMode: "class" — uses legacy :is() selector with default .dark class', async () => {
    expect(
      await run(
        ['dark:underline'],
        css`
          @tailwind utilities;
          @config "./config.js";
        `,
        {
          loadModule: async () => ({ module: { darkMode: 'class' }, base: '/root', path: '' }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .dark\\:underline:is(.dark *) {
        text-decoration-line: underline;
      }
      "
    `)
  })

  test('darkMode: ["class", ".night"] — uses legacy :is() selector with custom class', async () => {
    expect(
      await run(
        ['dark:underline'],
        css`
          @tailwind utilities;
          @config "./config.js";
        `,
        {
          loadModule: async () => ({
            module: { darkMode: ['class', '.night'] },
            base: '/root',
            path: '',
          }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .dark\\:underline:is(.night *) {
        text-decoration-line: underline;
      }
      "
    `)
  })

  // -------------------------------------------------------------------------
  // Previously-uncovered: darkMode: "variant" invalid selectors (warns)
  // -------------------------------------------------------------------------

  test('darkMode: ["variant", ".dark"] — warns when selector is exactly .dark (must provide a real selector)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await run(
      ['dark:underline'],
      css`
        @tailwind utilities;
        @config "./config.js";
      `,
      {
        loadModule: async () => ({
          module: { darkMode: ['variant', '.dark'] },
          base: '/root',
          path: '',
        }),
      },
    )

    expect(warn).toHaveBeenCalledWith(
      'When using `variant` for `darkMode`, you must provide a selector.\nExample: `darkMode: ["variant", ".your-selector &"]`',
    )

    warn.mockRestore()
  })

  test('darkMode: ["variant", ".no-ampersand"] — warns when selector does not contain &', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await run(
      ['dark:underline'],
      css`
        @tailwind utilities;
        @config "./config.js";
      `,
      {
        loadModule: async () => ({
          module: { darkMode: ['variant', '.no-ampersand'] },
          base: '/root',
          path: '',
        }),
      },
    )

    expect(warn).toHaveBeenCalledWith(
      'When using `variant` for `darkMode`, your selector must contain `&`.\nExample `darkMode: ["variant", ".your-selector &"]`',
    )

    warn.mockRestore()
  })

  test('darkMode: ["variant", [".dark", ".no-ampersand"]] — warns for each invalid selector in the array', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await run(
      ['dark:underline'],
      css`
        @tailwind utilities;
        @config "./config.js";
      `,
      {
        loadModule: async () => ({
          module: { darkMode: ['variant', ['.dark', '.no-ampersand']] },
          base: '/root',
          path: '',
        }),
      },
    )

    expect(warn).toHaveBeenCalledWith(
      'When using `variant` for `darkMode`, you must provide a selector.\nExample: `darkMode: ["variant", ".your-selector &"]`',
    )
    expect(warn).toHaveBeenCalledWith(
      'When using `variant` for `darkMode`, your selector must contain `&`.\nExample `darkMode: ["variant", ".your-selector &"]`',
    )

    warn.mockRestore()
  })

  // -------------------------------------------------------------------------
  // Previously-uncovered: darkMode: "variant" with valid selectors
  // -------------------------------------------------------------------------

  test('darkMode: ["variant", "&:where(:not(.light))"] — uses custom variant selector', async () => {
    expect(
      await run(
        ['dark:underline'],
        css`
          @tailwind utilities;
          @config "./config.js";
        `,
        {
          loadModule: async () => ({
            module: { darkMode: ['variant', '&:where(:not(.light))'] },
            base: '/root',
            path: '',
          }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .dark\\:underline:where(:not(.light)) {
        text-decoration-line: underline;
      }
      "
    `)
  })

  test('darkMode: ["variant", [".theme-dark &", ".dark &"]] — uses array of valid variant selectors', async () => {
    expect(
      await run(
        ['dark:underline'],
        css`
          @tailwind utilities;
          @config "./config.js";
        `,
        {
          loadModule: async () => ({
            module: { darkMode: ['variant', ['.theme-dark &', '.dark &']] },
            base: '/root',
            path: '',
          }),
        },
      ),
    ).toMatchInlineSnapshot(`
      "
      .theme-dark .dark\\:underline, .dark .dark\\:underline {
        text-decoration-line: underline;
      }
      "
    `)
  })
})
