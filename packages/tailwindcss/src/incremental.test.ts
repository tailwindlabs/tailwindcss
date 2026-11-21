import fs from 'node:fs'
import path from 'node:path'
import { expect, test, vi } from 'vitest'
import { compile } from './index'

const css = String.raw

async function loadStylesheet(id: string, base: string) {
  let file = id === 'tailwindcss' ? 'index.css' : id.replace(/^tailwindcss\//, '') + '.css'
  file = id.startsWith('tailwindcss') ? path.resolve(__dirname, '..', file) : path.resolve(base, id)
  return { path: file, base: path.dirname(file), content: fs.readFileSync(file, 'utf8') }
}

type Compiler = Awaited<ReturnType<typeof compile>>

// The non-incremental build that we compare against. This is `compile(…)` from
// a second copy of the modules, where the incremental build is turned off.
let referenceCompile: Promise<typeof compile> | null = null
async function loadReferenceCompile() {
  vi.resetModules()
  vi.doMock('./incremental', () => ({ createIncrementalBuild: () => null }))
  try {
    return (await import('./index')).compile
  } finally {
    vi.doUnmock('./incremental')
    vi.resetModules()
  }
}

// With `from`, the nodes have source locations, and the source maps are
// compared as well.
async function compilers(input: string, from?: string) {
  referenceCompile ??= loadReferenceCompile()
  let opts = { base: __dirname, loadStylesheet, from }
  let incremental = await compile(input, opts)
  let reference = await (await referenceCompile)(input, opts)
  return { incremental, reference }
}

function expectSameBuild(
  { incremental, reference }: { incremental: Compiler; reference: Compiler },
  candidates: string[],
) {
  let output = incremental.build(candidates)
  expect(output).toEqual(reference.build(candidates))
  expect(incremental.buildSourceMap()).toEqual(reference.buildSourceMap())
  return output
}

const CANDIDATES = [
  // Plain utilities, with and without variants
  'flex',
  'block',
  'p-4',
  'px-2',
  'hover:underline',
  'focus:hover:underline',
  'sm:flex',
  'sm:block',
  'md:flex',
  'lg:max-xl:block',
  'dark:md:hover:bg-red-500',
  'group-hover:underline',
  'peer-checked:bg-blue-500',
  'group-has-[input:checked]:flex',
  'has-[>img]:p-4',
  'not-first:flex',
  'not-sm:hidden',
  'in-[.dark]:text-white',
  '*:p-2',
  '**:p-2',
  '[&_p]:mt-2',
  '[@media(min-width:100px)]:flex',
  'supports-[display:grid]:flex',
  'not-supports-[display:grid]:float-left',
  '@container',
  '@md:flex',
  '@max-lg:hidden',
  'print:hidden',
  'motion-safe:animate-pulse',
  'starting:opacity-0',
  'backdrop:bg-black/50',
  'before:content-["x"]',
  'selection:bg-yellow-200',
  'placeholder:text-gray-400',
  'data-[state=open]:block',
  'aria-checked:bg-blue-500',
  'rtl:mr-2',

  // Utilities that generate `@property` rules and `@keyframes`
  'shadow-lg',
  'ring-2',
  'translate-x-4',
  'rotate-45',
  'blur-sm',
  'animate-spin',
  'hover:animate-bounce',
  'animate-[wiggle_1s_ease-in-out_infinite]',

  // Utilities that need the `color-mix(…)` polyfill
  'bg-red-500/50',
  'text-blue-500/[37%]',
  'bg-(--my-color)/50',

  // Arbitrary values and properties, important, negative values
  '[color:red]',
  'hover:[mask-type:alpha]',
  '[--scroll-offset:56px]',
  'text-[color:var(--x)]',
  'grid-cols-[repeat(auto-fill,minmax(100px,1fr))]',
  '!font-bold',
  'font-bold!',
  '-mt-4',
  'space-x-4',
  'sm:divide-x',

  // Custom utilities and variants from the input
  'tab-4',
  'content-auto',
  'pointer-fine:flex',
  'animate-wiggle',
  'bg-brand/50',

  // Invalid candidates
  'not-a-utility',
  'hover:not-a-utility',
  'unknown-variant:flex',
]

const INPUTS = {
  default: css`
    @import 'tailwindcss';
  `,
  'without layers': css`
    @import 'tailwindcss/theme';
    @tailwind utilities;
  `,
  'important and static theme': css`
    @import 'tailwindcss' important theme(static);
  `,
  'custom utilities, variants and siblings': css`
    @import 'tailwindcss';

    @theme {
      --color-brand: oklch(0.6 0.2 250);
      --animate-wiggle: wiggle 1s infinite;

      @keyframes wiggle {
        0%,
        100% {
          rotate: -3deg;
        }
        50% {
          rotate: 3deg;
        }
      }
    }

    @custom-variant pointer-fine (@media (pointer: fine));

    @utility tab-* {
      tab-size: --value(integer);
    }

    @utility content-auto {
      content-visibility: auto;
      &:hover {
        color: red;
      }
      @media (width >= 40rem) {
        color: blue;
      }
    }

    @layer utilities {
      @media (width >= 40rem) {
        .before-utilities {
          color: green;
        }
      }
    }

    .after-utilities {
      @apply flex hover:bg-brand;
    }
  `,
  'utilities nested in a rule': css`
    @import 'tailwindcss/theme';
    .scope {
      @tailwind utilities;
    }
  `,
}

test.each(
  Object.entries(INPUTS).flatMap(([name, input]) => [
    [name, input, undefined],
    [`${name}, with \`from\``, input, 'input.css'],
  ]),
)('incremental builds match the non-incremental build (%s)', async (_, input, from) => {
  // Add the candidates in a few different orders and batch sizes
  for (let order of [1, -1]) {
    let builds = await compilers(input, from)
    let candidates = CANDIDATES.slice().sort((a, z) => order * a.localeCompare(z))
    let used: string[] = []

    for (let size of [5, 1, 1, 3, 10, 1, 20, 100]) {
      used.push(...candidates.splice(0, size))
      expectSameBuild(builds, used)
    }

    // Nothing new
    expectSameBuild(builds, used)

    // Variables used outside of the utilities, e.g. in a `style` attribute
    used.push('--color-pink-500')
    expectSameBuild(builds, used)
  }
})

test('utilities added in later builds are merged into existing at-rules', async () => {
  let builds = await compilers(css`
    @theme {
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
    }
    @tailwind utilities;
  `)

  // Each build merges new utilities into the `@media` rules of the cached
  // utilities. The cached utilities must not be changed by that, otherwise
  // the next build would contain duplicates.
  let steps = [['sm:flex', 'sm:underline'], ['sm:block'], ['md:flex'], ['flex', 'sm:hidden']]

  let used: string[] = []
  let output = ''
  for (let step of steps) {
    used.push(...step)
    output = expectSameBuild(builds, used)
  }

  expect(output).toMatchInlineSnapshot(`
    ".flex {
      display: flex;
    }
    @media (width >= 40rem) {
      .sm\\:block {
        display: block;
      }
      .sm\\:flex {
        display: flex;
      }
      .sm\\:hidden {
        display: none;
      }
      .sm\\:underline {
        text-decoration-line: underline;
      }
    }
    @media (width >= 48rem) {
      .md\\:flex {
        display: flex;
      }
    }
    "
  `)
})

test.each([
  ['@media', 'print'],
  ['@supports', '(display: grid)'],
  ['@container', '(width > 10rem)'],
])('at-rules around the utilities are removed without utilities (%s %s)', async (name, params) => {
  for (let from of [undefined, 'input.css']) {
    let builds = await compilers(
      css`
        @import 'tailwindcss/theme';
        ${name} ${params} {
          @tailwind utilities;
        }
        .after {
          color: red;
        }
      `,
      from,
    )

    // None of the candidates are valid, so there are no utilities in the at-rule
    let used = ['not-a-utility']
    expectSameBuild(builds, used)

    used.push('flex')
    expectSameBuild(builds, used)
  }
})

test('builds with a very large number of utilities', async () => {
  let { incremental } = await compilers(css`
    @tailwind utilities;
  `)

  // Each utility is a separate node at the root. A list this large overflows
  // the call stack when it's spread into the arguments of a function call.
  let candidates = Array.from({ length: 150_000 }, (_, i) => `w-[${i}px]`)
  expect(incremental.build(candidates)).toContain('.w-\\[149999px\\] {')
})
