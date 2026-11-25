import fs from 'node:fs/promises'
import path from 'node:path'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { __unstable__loadDesignSystem, compile } from '.'
import { compileCss } from './test-utils/run'

const css = String.raw

// Build-time switches are normally replaced with a constant by a bundler, see
// `node.d.ts`. In these tests we change them at runtime instead, which works
// because they are checked right where they are used.
afterEach(() => {
  vi.unstubAllEnvs()
})

async function loadStylesheet(id: string, base: string) {
  if (id === 'tailwindcss') id = './index.css'

  let file = path.resolve(__dirname, '..', id)
  return { path: file, base, content: await fs.readFile(file, 'utf8') }
}

async function build(candidates: string[]) {
  let compiler = await compile(
    css`
      @import 'tailwindcss';
    `,
    { loadStylesheet },
  )

  return compiler.build(candidates)
}

// Every class that IntelliSense knows about, on its own and with a variant,
// plus a few classes that need to be parsed.
async function candidates() {
  let design = await __unstable__loadDesignSystem(
    css`
      @import 'tailwindcss';
    `,
    { loadStylesheet },
  )

  let candidates: string[] = []
  for (let [name, meta] of design.getClassList()) {
    candidates.push(name, `hover:${name}`)
    if (meta.modifiers.length > 0) candidates.push(`${name}/${meta.modifiers[0]}`)
  }

  candidates.push(
    'w-[calc(100%-2rem)]',
    'bg-[theme(colors.red.500)]',
    'text-[color:var(--my-color)]',
    '[mask-type:alpha]',
    'group-hover/sidebar:not-data-active:underline',
    'max-w-screen-md',
    'bg-gradient-to-r',
    'does-not-exist',
  )

  return candidates
}

test(
  'turning off the switches does not change the generated CSS',
  { timeout: 30_000 },
  async () => {
    let classes = await candidates()
    expect(classes.length).toBeGreaterThan(10_000)

    let expected = await build(classes)

    vi.stubEnv('TAILWIND_INTELLISENSE', 'false')
    vi.stubEnv('TAILWIND_JS_PLUGINS', 'false')

    expect(await build(classes)).toBe(expected)
  },
)

describe('TAILWIND_INTELLISENSE', () => {
  test('nothing is suggested when turned off', async () => {
    vi.stubEnv('TAILWIND_INTELLISENSE', 'false')

    let design = await __unstable__loadDesignSystem(
      css`
        @import 'tailwindcss';
      `,
      { loadStylesheet },
    )

    expect(design.getClassList()).toEqual([])
    expect(design.getVariants()).toEqual([])
    expect(design.canonicalizeCandidates(['[display:flex]', 'underline'])).toEqual([
      '[display:flex]',
      'underline',
    ])
  })
})

describe('TAILWIND_JS_PLUGINS', () => {
  test('`@plugin` is not supported when turned off', async () => {
    vi.stubEnv('TAILWIND_JS_PLUGINS', 'false')

    let loadModule = vi.fn()

    await expect(
      compile(
        css`
          @plugin "./my-plugin.js";
        `,
        { loadModule },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: This build of Tailwind CSS does not support \`@plugin\` or \`@config\`.]`,
    )
    expect(loadModule).not.toHaveBeenCalled()
  })

  test('`@config` is not supported when turned off', async () => {
    vi.stubEnv('TAILWIND_JS_PLUGINS', 'false')

    let loadModule = vi.fn()

    await expect(
      compile(
        css`
          @config "./tailwind.config.js";
        `,
        { loadModule },
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: This build of Tailwind CSS does not support \`@plugin\` or \`@config\`.]`,
    )
    expect(loadModule).not.toHaveBeenCalled()
  })

  test('legacy `theme()` paths resolve to theme variables when turned off', async () => {
    vi.stubEnv('TAILWIND_JS_PLUGINS', 'false')

    expect(
      await compileCss(css`
        @theme {
          --color-red-500: #ef4444;
          --breakpoint-md: 48rem;
          --text-sm: 0.875rem;
          --font-sans: ui-sans-serif, system-ui;
        }

        .example {
          color: theme(colors.red.500);
          background-color: theme(colors.red.500 / 50%);
          min-width: theme(screens.md);
          font-size: theme(fontSize.sm);
          font-family: theme(fontFamily.sans);
          outline-color: theme(--color-red-500);
          width: theme(spacing.4, 1rem);
        }
      `),
    ).toMatchInlineSnapshot(`
      "
      .example {
        color: #ef4444;
        background-color: oklab(63.6834% .187 .088 / .5);
        outline-color: #ef4444;
        width: 1rem;
        min-width: 48rem;
        font-family: ui-sans-serif, system-ui;
        font-size: .875rem;
      }
      "
    `)
  })

  test('legacy `theme()` paths that need the JS theme do not resolve when turned off', async () => {
    let input = css`
      .example {
        width: theme(spacing.4);
      }
    `

    expect(await compileCss(input)).toMatchInlineSnapshot(`
      "
      .example {
        width: 1rem;
      }
      "
    `)

    vi.stubEnv('TAILWIND_JS_PLUGINS', 'false')

    await expect(compileCss(input)).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Could not resolve value for theme function: \`theme(spacing.4)\`. Consider checking if the path is correct or provide a fallback value to silence this error.]`,
    )
  })
})
