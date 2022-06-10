import fs from 'fs'
import path from 'path'

import { run, html, css, defaults } from './util/run'

test('@apply', () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './apply.test.html')],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .basic-example {
        @apply rounded-md bg-blue-500 px-4 py-2;
      }
      .class-order {
        @apply p-8 px-3 py-7 pt-4 pr-1;
      }
      .with-additional-properties {
        font-weight: 500;
        @apply text-right;
      }
      .variants {
        @apply font-semibold hover:font-bold focus:font-medium lg:font-light xl:focus:font-black;
      }
      .only-variants {
        @apply hover:font-bold focus:font-medium lg:font-light xl:focus:font-black;
      }
      .apply-group-variant {
        @apply group-hover:text-center lg:group-hover:text-left;
      }
      .apply-dark-variant {
        @apply dark:text-center dark:hover:text-right lg:dark:text-left;
      }
      .apply-custom-utility {
        @apply custom-util hover:custom-util lg:custom-util xl:focus:custom-util;
      }
      .multiple,
      .selectors {
        @apply rounded-md bg-blue-500 px-4 py-2;
      }
      .multiple-variants,
      .selectors-variants {
        @apply hover:text-center active:text-right lg:focus:text-left;
      }
      .multiple-group,
      .selectors-group {
        @apply group-hover:text-center lg:group-hover:text-left;
      }
      .complex-utilities {
        @apply ordinal tabular-nums shadow-lg hover:shadow-xl focus:diagonal-fractions;
      }
      .use-base-only-a {
        @apply font-bold;
      }
      .use-base-only-b {
        @apply use-base-only-a font-normal;
      }
      .use-dependant-only-a {
        @apply font-bold;
      }
      .use-dependant-only-b {
        @apply use-dependant-only-a font-normal;
      }
      .btn {
        @apply rounded py-2 px-4 font-bold;
      }
      .btn-blue {
        @apply btn bg-blue-500 text-white hover:bg-blue-700;
      }
      .recursive-apply-a {
        @apply font-black sm:font-thin;
      }
      .recursive-apply-b {
        @apply recursive-apply-a font-semibold md:font-extralight;
      }
      .recursive-apply-c {
        @apply recursive-apply-b font-bold lg:font-light;
      }
      .use-with-other-properties-base {
        color: green;
        @apply font-bold;
      }
      .use-with-other-properties-component {
        @apply use-with-other-properties-base;
      }
      .add-sibling-properties {
        padding: 2rem;
        @apply px-4 hover:px-2 lg:px-10 xl:focus:px-1;
        padding-top: 3px;
        @apply use-with-other-properties-base;
      }

      h1 {
        @apply text-2xl sm:text-3xl lg:text-2xl;
      }
      h2 {
        @apply text-2xl;
        @apply lg:text-2xl;
        @apply sm:text-2xl;
      }

      .important-modifier {
        @apply !rounded-md px-4;
      }

      .important-modifier-variant {
        @apply px-4 hover:!rounded-md;
      }
    }

    @layer utilities {
      .custom-util {
        custom: stuff;
      }

      .foo {
        @apply animate-spin;
      }

      .bar {
        @apply animate-pulse !important;
      }
    }
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './apply.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('@apply error with unknown utility', async () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './apply.test.html')],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo {
        @apply a-utility-that-does-not-exist;
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError('class does not exist')
})

test('@apply error with nested @screen', async () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './apply.test.html')],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo {
        @screen md {
          @apply text-black;
        }
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    '@apply is not supported within nested at-rules like @screen'
  )
})

test('@apply error with nested @anyatrulehere', async () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './apply.test.html')],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo {
        @genie {
          @apply text-black;
        }
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    '@apply is not supported within nested at-rules like @genie'
  )
})

test('@apply error when using .group utility', async () => {
  let config = {
    darkMode: 'class',
    content: [{ raw: '<div class="foo"></div>' }],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo {
        @apply group;
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    `@apply should not be used with the 'group' utility`
  )
})

test('@apply error when using a prefixed .group utility', async () => {
  let config = {
    prefix: 'tw-',
    darkMode: 'class',
    content: [{ raw: html`<div class="foo"></div>` }],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo {
        @apply tw-group;
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    `@apply should not be used with the 'tw-group' utility`
  )
})

test('@apply error when using .peer utility', async () => {
  let config = {
    darkMode: 'class',
    content: [{ raw: '<div class="foo"></div>' }],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo {
        @apply peer;
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    `@apply should not be used with the 'peer' utility`
  )
})

test('@apply error when using a prefixed .peer utility', async () => {
  let config = {
    prefix: 'tw-',
    darkMode: 'class',
    content: [{ raw: html`<div class="foo"></div>` }],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo {
        @apply tw-peer;
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    `@apply should not be used with the 'tw-peer' utility`
  )
})

test('@apply classes from outside a @layer', async () => {
  let config = {
    content: [{ raw: html`<div class="foo bar baz font-bold"></div>` }],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    .foo {
      @apply font-bold;
    }

    .bar {
      @apply foo text-red-500 hover:text-green-500;
    }

    .baz {
      @apply bar underline;
    }

    .keep-me-even-though-I-am-not-used-in-content {
      color: green;
    }
  `

  await run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }

      .foo {
        font-weight: 700;
      }

      .bar {
        --tw-text-opacity: 1;
        color: rgb(239 68 68 / var(--tw-text-opacity));
        font-weight: 700;
      }

      .bar:hover {
        --tw-text-opacity: 1;
        color: rgb(34 197 94 / var(--tw-text-opacity));
      }

      .baz {
        text-decoration-line: underline;
        --tw-text-opacity: 1;
        color: rgb(239 68 68 / var(--tw-text-opacity));
        font-weight: 700;
      }

      .baz:hover {
        --tw-text-opacity: 1;
        color: rgb(34 197 94 / var(--tw-text-opacity));
      }

      .keep-me-even-though-I-am-not-used-in-content {
        color: green;
      }
    `)
  })
})

test('@applying classes from outside a @layer respects the source order', async () => {
  let config = {
    content: [{ raw: html`<div class="foo bar baz container font-bold"></div>` }],
  }

  let input = css`
    .baz {
      @apply bar underline;
    }

    @tailwind components;

    .keep-me-even-though-I-am-not-used-in-content {
      color: green;
    }

    @tailwind utilities;

    .foo {
      @apply font-bold;
    }

    .bar {
      @apply no-underline;
    }
  `

  await run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .baz {
        text-decoration-line: underline;
        text-decoration-line: none;
      }

      .container {
        width: 100%;
      }
      @media (min-width: 640px) {
        .container {
          max-width: 640px;
        }
      }
      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }
      @media (min-width: 1024px) {
        .container {
          max-width: 1024px;
        }
      }
      @media (min-width: 1280px) {
        .container {
          max-width: 1280px;
        }
      }
      @media (min-width: 1536px) {
        .container {
          max-width: 1536px;
        }
      }

      .keep-me-even-though-I-am-not-used-in-content {
        color: green;
      }

      .font-bold {
        font-weight: 700;
      }

      .foo {
        font-weight: 700;
      }

      .bar {
        text-decoration-line: none;
      }
    `)
  })
})

it('should remove duplicate properties when using apply with similar properties', () => {
  let config = {
    content: [{ raw: 'foo' }],
  }

  let input = css`
    @tailwind utilities;

    .foo {
      @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        position: absolute;
        top: 50%;
        left: 50%;
        --tw-translate-x: -50%;
        --tw-translate-y: -50%;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

it('should apply all the definitions of a class', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer utilities {
      .aspect-w-1 {
        position: relative;
      }

      .aspect-w-1 {
        --tw-aspect-w: 1;
      }
    }

    @layer components {
      .foo {
        @apply aspect-w-1;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .foo {
        position: relative;
        --tw-aspect-w: 1;
      }
    `)
  })
})

it('should throw when trying to apply a direct circular dependency', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo:not(.text-red-500) {
        @apply text-red-500;
      }
    }
  `

  return run(input, config).catch((err) => {
    expect(err.reason).toBe(
      'You cannot `@apply` the `text-red-500` utility here because it creates a circular dependency.'
    )
  })
})

it('should throw when trying to apply an indirect circular dependency', () => {
  let config = {
    content: [{ raw: html`<div class="a"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .a {
        @apply b;
      }

      .b {
        @apply c;
      }

      .c {
        @apply a;
      }
    }
  `

  return run(input, config).catch((err) => {
    expect(err.reason).toBe(
      'You cannot `@apply` the `a` utility here because it creates a circular dependency.'
    )
  })
})

it('should not throw when the selector is different (but contains the base partially)', () => {
  let config = {
    content: [{ raw: html`<div class="bg-gray-500"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    .focus\:bg-gray-500 {
      @apply bg-gray-500;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-gray-500 {
        --tw-bg-opacity: 1;
        background-color: rgb(107 114 128 / var(--tw-bg-opacity));
      }

      .focus\:bg-gray-500 {
        --tw-bg-opacity: 1;
        background-color: rgb(107 114 128 / var(--tw-bg-opacity));
      }
    `)
  })
})

it('should throw when trying to apply an indirect circular dependency with a modifier (1)', () => {
  let config = {
    content: [{ raw: html`<div class="a"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .a {
        @apply b;
      }

      .b {
        @apply c;
      }

      .c {
        @apply hover:a;
      }
    }
  `

  return run(input, config).catch((err) => {
    expect(err.reason).toBe(
      'You cannot `@apply` the `hover:a` utility here because it creates a circular dependency.'
    )
  })
})

it('should throw when trying to apply an indirect circular dependency with a modifier (2)', () => {
  let config = {
    content: [{ raw: html`<div class="a"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .a {
        @apply b;
      }

      .b {
        @apply hover:c;
      }

      .c {
        @apply a;
      }
    }
  `

  return run(input, config).catch((err) => {
    expect(err.reason).toBe(
      'You cannot `@apply` the `a` utility here because it creates a circular dependency.'
    )
  })
})

it('should not throw when the circular dependency is part of a different selector (1)', () => {
  let config = {
    content: [{ raw: html`<div class="c"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      html.dark .a,
      .b {
        color: red;
      }
    }

    html.dark .c {
      @apply b;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      html.dark .c {
        color: red;
      }
    `)
  })
})

it('should not throw when the circular dependency is part of a different selector (2)', () => {
  let config = {
    content: [{ raw: html`<div class="c"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      html.dark .a,
      .b {
        color: red;
      }
    }

    html.dark .c {
      @apply hover:b;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      html.dark .c:hover {
        color: red;
      }
    `)
  })
})

it('should throw when the circular dependency is part of the same selector', () => {
  let config = {
    content: [{ raw: html`<div class="c"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      html.dark .a,
      html.dark .b {
        color: red;
      }
    }

    html.dark .c {
      @apply hover:b;
    }
  `

  return run(input, config).catch((err) => {
    expect(err.reason).toBe(
      'You cannot `@apply` the `hover:b` utility here because it creates a circular dependency.'
    )
  })
})

it('rules with vendor prefixes are still separate when optimizing defaults rules', () => {
  let config = {
    experimental: { optimizeUniversalDefaults: true },
    content: [{ raw: html`<div class="border"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer components {
      input[type='range']::-moz-range-thumb {
        @apply border;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      input[type='range']::-moz-range-thumb {
        border-width: 1px;
      }
      .border {
        border-width: 1px;
      }
    `)
  })
})

it('should be possible to apply user css', () => {
  let config = {
    content: [{ raw: html`<div></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    .foo {
      color: red;
    }

    .bar {
      @apply foo;
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .foo {
        color: red;
      }

      .bar {
        color: red;
      }
    `)
  })
})

it('should not be possible to apply user css with variants', () => {
  let config = {
    content: [{ raw: html`<div></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    .foo {
      color: red;
    }

    .bar {
      @apply hover:foo;
    }
  `

  return run(input, config).catch((err) => {
    expect(err.reason).toBe(
      'The `hover:foo` class does not exist. If `hover:foo` is a custom class, make sure it is defined within a `@layer` directive.'
    )
  })
})

it('should not apply unrelated siblings when applying something from within atrules', () => {
  let config = {
    content: [{ raw: html`<div class="foo bar something-unrelated"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .foo {
        font-weight: bold;
        @apply bar;
      }

      .bar {
        color: green;
      }

      @supports (a: b) {
        .bar {
          color: blue;
        }

        .something-unrelated {
          color: red;
        }
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo {
        font-weight: bold;
        color: green;
      }

      @supports (a: b) {
        .foo {
          color: blue;
        }
      }

      .bar {
        color: green;
      }

      @supports (a: b) {
        .bar {
          color: blue;
        }

        .something-unrelated {
          color: red;
        }
      }
    `)
  })
})

it('should be possible to apply user css without tailwind directives', () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
    plugins: [],
  }

  let input = css`
    .bop {
      color: red;
    }
    .bar {
      background-color: blue;
    }
    .foo {
      @apply bar bop absolute;
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .bop {
        color: red;
      }
      .bar {
        background-color: blue;
      }
      .foo {
        position: absolute;
        color: red;
        background-color: blue;
      }
    `)
  })
})

it('should be possible to apply a class from another rule with multiple selectors (2 classes)', () => {
  let config = {
    content: [{ raw: html`<div class="c"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .a,
      .b {
        @apply underline;
      }

      .c {
        @apply b;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .c {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should be possible to apply a class from another rule with multiple selectors (1 class, 1 tag)', () => {
  let config = {
    content: [{ raw: html`<div class="c"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      span,
      .b {
        @apply underline;
      }

      .c {
        @apply b;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      span,
      .b {
        text-decoration-line: underline;
      }

      .c {
        text-decoration-line: underline;
      }
    `)
  })
})

it('should be possible to apply a class from another rule with multiple selectors (1 class, 1 id)', () => {
  let config = {
    content: [{ raw: html`<div class="c"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      #a,
      .b {
        @apply underline;
      }

      .c {
        @apply b;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      #a,
      .b {
        text-decoration-line: underline;
      }

      .c {
        text-decoration-line: underline;
      }
    `)
  })
})

describe('multiple instances', () => {
  it('should be possible to apply multiple "instances" of the same class', () => {
    let config = {
      content: [{ raw: html`` }],
      plugins: [],
      corePlugins: { preflight: false },
    }

    let input = css`
      .a {
        @apply b;
      }

      .b {
        @apply uppercase;
      }

      .b {
        color: red;
      }
    `

    return run(input, config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        .a {
          text-transform: uppercase;
          color: red;
        }

        .b {
          text-transform: uppercase;
          color: red;
        }
      `)
    })
  })

  it('should be possible to apply a combination of multiple "instances" of the same class', () => {
    let config = {
      content: [{ raw: html`` }],
      plugins: [],
      corePlugins: { preflight: false },
    }

    let input = css`
      .a {
        @apply b;
      }

      .b {
        @apply uppercase;
        color: red;
      }
    `

    return run(input, config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        .a {
          text-transform: uppercase;
          color: red;
        }

        .b {
          text-transform: uppercase;
          color: red;
        }
      `)
    })
  })

  it('should generate the same output, even if it was used in a @layer', () => {
    let config = {
      content: [{ raw: html`<div class="a b"></div>` }],
      plugins: [],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind components;

      @layer components {
        .a {
          @apply b;
        }

        .b {
          @apply uppercase;
          color: red;
        }
      }
    `

    return run(input, config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        .a {
          text-transform: uppercase;
          color: red;
        }

        .b {
          text-transform: uppercase;
          color: red;
        }
      `)
    })
  })

  it('should be possible to apply a combination of multiple "instances" of the same class (defined in a layer)', () => {
    let config = {
      content: [{ raw: html`<div class="a b"></div>` }],
      plugins: [],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind components;

      @layer components {
        .a {
          color: red;
          @apply b;
          color: blue;
        }

        .b {
          @apply text-green-500;
          text-decoration: underline;
        }
      }
    `

    return run(input, config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        .a {
          color: red;
          --tw-text-opacity: 1;
          color: rgb(34 197 94 / var(--tw-text-opacity));
          text-decoration: underline;
          color: blue;
        }

        .b {
          --tw-text-opacity: 1;
          color: rgb(34 197 94 / var(--tw-text-opacity));
          text-decoration: underline;
        }
      `)
    })
  })

  it('should properly maintain the order', () => {
    let config = {
      content: [{ raw: html`` }],
      plugins: [],
      corePlugins: { preflight: false },
    }

    let input = css`
      h2 {
        @apply text-xl;
        @apply lg:text-3xl;
        @apply sm:text-2xl;
      }
    `

    return run(input, config).then((result) => {
      return expect(result.css).toMatchFormattedCss(css`
        h2 {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }

        @media (min-width: 1024px) {
          h2 {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }
        }

        @media (min-width: 640px) {
          h2 {
            font-size: 1.5rem;
            line-height: 2rem;
          }
        }
      `)
    })
  })
})

it('apply can emit defaults in isolated environments without @tailwind directives', () => {
  let config = {
    experimental: { optimizeUniversalDefaults: true },

    content: [{ raw: html`<div class="foo"></div>` }],
  }

  let input = css`
    .foo {
      @apply focus:rotate-90;
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .foo:focus {
        --tw-rotate: 90deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

it('apply does not emit defaults in isolated environments without optimizeUniversalDefaults', () => {
  let config = {
    experimental: { optimizeUniversalDefaults: false },
    content: [{ raw: html`<div class="foo"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;

    .foo {
      @apply focus:rotate-90;
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      ${defaults}
      .foo:focus {
        --tw-rotate: 90deg;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
    `)
  })
})

it('should work outside of layer', async () => {
  let config = {
    content: [{ raw: html`<div class="input-text"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    .input-text {
      @apply bg-white;
      background-color: red;
    }
  `

  let result
  result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .input-text {
      --tw-bg-opacity: 1;
      background-color: rgb(255 255 255 / var(--tw-bg-opacity));
      background-color: red;
    }
  `)

  result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .input-text {
      --tw-bg-opacity: 1;
      background-color: rgb(255 255 255 / var(--tw-bg-opacity));
      background-color: red;
    }
  `)
})

it('should work in layer', async () => {
  let config = {
    content: [{ raw: html`<div class="input-text"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind components;
    @layer components {
      .input-text {
        @apply bg-white;
        background-color: red;
      }
    }
  `

  await run(input, config)
  const result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .input-text {
      --tw-bg-opacity: 1;
      background-color: rgb(255 255 255 / var(--tw-bg-opacity));
      background-color: red;
    }
  `)
})

it('apply partitioning works with media queries', async () => {
  let config = {
    content: [{ raw: html`` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @layer base {
      html,
      body {
        @apply text-green-600;
        font-size: 1rem;
      }

      @media print {
        html,
        body {
          @apply text-red-600;
          font-size: 2rem;
        }
      }
    }
  `

  await run(input, config)
  const result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    html,
    body {
      --tw-text-opacity: 1;
      color: rgb(22 163 74 / var(--tw-text-opacity));
      font-size: 1rem;
    }

    @media print {
      html,
      body {
        --tw-text-opacity: 1;
        color: rgb(220 38 38 / var(--tw-text-opacity));
        font-size: 2rem;
      }
    }
    ${defaults}
  `)
})

it('should be possible to use apply in plugins', async () => {
  let config = {
    content: [{ raw: html`<div class="a b"></div>` }],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addComponents }) {
        addComponents({
          '.a': {
            color: 'red',
          },
          '.b': {
            '@apply a': {},
            color: 'blue',
          },
        })
      },
    ],
  }

  return run('@tailwind components', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .a {
        color: red;
      }

      .b {
        color: red;
        color: blue;
      }
    `)
  })
})

it('should apply using the updated user CSS when the source has changed', async () => {
  let config = {
    content: [{ raw: html`<div></div>` }],
    plugins: [],
  }

  let inputBefore = css`
    .foo {
      color: green;
    }

    .bar {
      @apply foo;
    }
  `

  let inputAfter = css`
    .foo {
      color: red;
    }

    .bar {
      @apply foo;
    }
  `

  let result = await run(inputBefore, config)

  expect(result.css).toMatchFormattedCss(css`
    .foo {
      color: green;
    }

    .bar {
      color: green;
    }
  `)

  result = await run(inputAfter, config)

  expect(result.css).toMatchFormattedCss(css`
    .foo {
      color: red;
    }

    .bar {
      color: red;
    }
  `)
})

it('apply + layer utilities + selector variants (like group) + important selector', async () => {
  let config = {
    important: '#myselector',
    content: [{ raw: html`<div class="custom-utility"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .custom-utility {
        @apply font-normal group-hover:underline;
      }
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    #myselector .custom-utility {
      font-weight: 400;
    }

    #myselector .group:hover .custom-utility {
      text-decoration-line: underline;
    }
  `)
})

it('apply + user CSS + selector variants (like group) + important selector (1)', async () => {
  let config = {
    important: '#myselector',
    content: [{ raw: html`<div class="custom-utility"></div>` }],
    plugins: [],
  }

  let input = css`
    .custom-utility {
      @apply font-normal group-hover:underline;
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .custom-utility {
      font-weight: 400;
    }

    .group:hover .custom-utility {
      text-decoration-line: underline;
    }
  `)
})

it('apply + user CSS + selector variants (like group) + important selector (2)', async () => {
  let config = {
    important: '#myselector',
    content: [{ raw: html`<div class="custom-utility"></div>` }],
    plugins: [],
  }

  let input = css`
    #myselector .custom-utility {
      @apply font-normal group-hover:underline;
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    #myselector .custom-utility {
      font-weight: 400;
    }

    .group:hover #myselector .custom-utility {
      text-decoration-line: underline;
    }
  `)
})
