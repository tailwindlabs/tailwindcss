import fs from 'fs'
import path from 'path'

import { run, html, css } from './util/run'

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
        @apply px-4 py-2 bg-blue-500 rounded-md;
      }
      .class-order {
        @apply pt-4 pr-1 px-3 py-7 p-8;
      }
      .with-additional-properties {
        font-weight: 500;
        @apply text-right;
      }
      .variants {
        @apply xl:focus:font-black hover:font-bold lg:font-light focus:font-medium font-semibold;
      }
      .only-variants {
        @apply xl:focus:font-black hover:font-bold lg:font-light focus:font-medium;
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
        @apply px-4 py-2 bg-blue-500 rounded-md;
      }
      .multiple-variants,
      .selectors-variants {
        @apply hover:text-center active:text-right lg:focus:text-left;
      }
      .multiple-group,
      .selectors-group {
        @apply group-hover:text-center lg:group-hover:text-left;
      }
      /* TODO: This works but the generated CSS is unnecessarily verbose. */
      .complex-utilities {
        @apply ordinal tabular-nums focus:diagonal-fractions shadow-lg hover:shadow-xl;
      }
      .basic-nesting-parent {
        .basic-nesting-child {
          @apply font-bold hover:font-normal;
        }
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
        @apply font-bold py-2 px-4 rounded;
      }
      .btn-blue {
        @apply btn bg-blue-500 hover:bg-blue-700 text-white;
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
        @apply text-2xl lg:text-2xl sm:text-3xl;
      }
      h2 {
        @apply text-2xl;
        @apply lg:text-2xl;
        @apply sm:text-2xl;
      }

      .important-modifier {
        @apply px-4 !rounded-md;
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

test('@apply classes from outside a @layer', async () => {
  let config = {
    content: [{ raw: html`<div class="font-bold foo bar baz"></div>` }],
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
        text-decoration: underline;
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
    content: [{ raw: html`<div class="container font-bold foo bar baz"></div>` }],
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
        text-decoration: none;
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
        text-decoration: none;
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
      @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
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
        transform: var(--tw-transform);
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
    expect(err.reason).toBe('Circular dependency detected when using: `@apply text-red-500`')
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
    expect(err.reason).toBe('Circular dependency detected when using: `@apply a`')
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
    expect(err.reason).toBe('Circular dependency detected when using: `@apply hover:a`')
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
    expect(err.reason).toBe('Circular dependency detected when using: `@apply a`')
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
      [type='range']::-moz-range-thumb {
        --tw-border-opacity: 1;
        border-color: rgb(229 231 235 / var(--tw-border-opacity));
      }
      .border {
        --tw-border-opacity: 1;
        border-color: rgb(229 231 235 / var(--tw-border-opacity));
      }
      input[type='range']::-moz-range-thumb {
        border-width: 1px;
      }
      .border {
        border-width: 1px;
      }
    `)
  })
})
