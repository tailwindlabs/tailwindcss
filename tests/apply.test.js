import { run, html, css, defaults } from './util/run'

let sharedHtml = html`
  <div class="basic-example"></div>
  <div class="class-order"></div>
  <div class="with-additional-properties"></div>
  <div class="variants"></div>
  <div class="only-variants"></div>
  <div class="apply-group-variant"></div>
  <div class="apply-dark-variant"></div>
  <div class="apply-custom-utility"></div>
  <div class="multiple selectors"></div>
  <div class="multiple-variants selectors-variants"></div>
  <div class="multiple-group selectors-group"></div>
  <div class="complex-utilities"></div>
  <div class="basic-nesting-parent">
    <div class="basic-nesting-child"></div>
  </div>
  <div class="use-base-only-a"></div>
  <div class="use-dependant-only-b"></div>
  <div class="btn"></div>
  <div class="btn-blue"></div>
  <div class="recursive-apply-a"></div>
  <div class="recursive-apply-b"></div>
  <div class="recursive-apply-c"></div>
  <div class="use-with-other-properties-base use-with-other-properties-component"></div>
  <div class="add-sibling-properties"></div>
  <div class="important-modifier"></div>
  <div class="important-modifier-variant"></div>
  <div class="a b"></div>
  <div class="foo"></div>
  <div class="bar"></div>
`

test('@apply', () => {
  let config = {
    darkMode: 'selector',
    content: [{ raw: sharedHtml }],
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
    expect(result.css).toMatchFormattedCss(css`
      .basic-example {
        --tw-bg-opacity: 1;
        background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        border-radius: 0.375rem;
        padding: 0.5rem 1rem;
      }
      .class-order {
        padding: 1rem 0.25rem 1.75rem 0.75rem;
      }
      .with-additional-properties {
        text-align: right;
        font-weight: 500;
      }
      .variants {
        font-weight: 600;
      }
      .variants:hover {
        font-weight: 700;
      }
      .variants:focus {
        font-weight: 500;
      }
      @media (min-width: 1024px) {
        .variants {
          font-weight: 300;
        }
      }
      @media (min-width: 1280px) {
        .variants:focus {
          font-weight: 900;
        }
      }
      .only-variants:hover {
        font-weight: 700;
      }
      .only-variants:focus {
        font-weight: 500;
      }
      @media (min-width: 1024px) {
        .only-variants {
          font-weight: 300;
        }
      }
      @media (min-width: 1280px) {
        .only-variants:focus {
          font-weight: 900;
        }
      }
      .group:hover .apply-group-variant {
        text-align: center;
      }
      @media (min-width: 1024px) {
        .group:hover .apply-group-variant {
          text-align: left;
        }
      }
      .apply-dark-variant:where(.dark, .dark *) {
        text-align: center;
      }
      .apply-dark-variant:hover:where(.dark, .dark *) {
        text-align: right;
      }
      @media (min-width: 1024px) {
        .apply-dark-variant:where(.dark, .dark *) {
          text-align: left;
        }
      }
      .apply-custom-utility,
      .apply-custom-utility:hover {
        custom: stuff;
      }
      @media (min-width: 1024px) {
        .apply-custom-utility {
          custom: stuff;
        }
      }
      @media (min-width: 1280px) {
        .apply-custom-utility:focus {
          custom: stuff;
        }
      }
      .multiple,
      .selectors {
        --tw-bg-opacity: 1;
        background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        border-radius: 0.375rem;
        padding: 0.5rem 1rem;
      }
      .multiple-variants:hover,
      .selectors-variants:hover {
        text-align: center;
      }
      .multiple-variants:active,
      .selectors-variants:active {
        text-align: right;
      }
      @media (min-width: 1024px) {
        .multiple-variants:focus,
        .selectors-variants:focus {
          text-align: left;
        }
      }
      .group:hover .multiple-group,
      .group:hover .selectors-group {
        text-align: center;
      }
      @media (min-width: 1024px) {
        .group:hover .multiple-group,
        .group:hover .selectors-group {
          text-align: left;
        }
      }
      .complex-utilities {
        --tw-ordinal: ordinal;
        --tw-numeric-spacing: tabular-nums;
        font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure)
          var(--tw-numeric-spacing) var(--tw-numeric-fraction);
        --tw-shadow: 0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a;
        --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
          0 4px 6px -4px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      .complex-utilities:hover {
        --tw-shadow: 0 20px 25px -5px #0000001a, 0 8px 10px -6px #0000001a;
        --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),
          0 8px 10px -6px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      .complex-utilities:focus {
        --tw-numeric-fraction: diagonal-fractions;
        font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure)
          var(--tw-numeric-spacing) var(--tw-numeric-fraction);
      }
      .use-base-only-a {
        font-weight: 700;
      }
      .use-dependant-only-b {
        font-weight: 400;
      }
      .btn {
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        font-weight: 700;
      }
      .btn-blue {
        --tw-bg-opacity: 1;
        background-color: rgb(59 130 246 / var(--tw-bg-opacity));
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        font-weight: 700;
      }
      .btn-blue:hover {
        --tw-bg-opacity: 1;
        background-color: rgb(29 78 216 / var(--tw-bg-opacity));
      }
      .recursive-apply-a {
        font-weight: 900;
      }
      @media (min-width: 640px) {
        .recursive-apply-a {
          font-weight: 100;
        }
      }
      .recursive-apply-b {
        font-weight: 900;
      }
      @media (min-width: 640px) {
        .recursive-apply-b {
          font-weight: 100;
        }
      }
      .recursive-apply-b {
        font-weight: 600;
      }
      @media (min-width: 768px) {
        .recursive-apply-b {
          font-weight: 200;
        }
      }
      .recursive-apply-c {
        font-weight: 900;
      }
      @media (min-width: 640px) {
        .recursive-apply-c {
          font-weight: 100;
        }
      }
      .recursive-apply-c {
        font-weight: 600;
      }
      @media (min-width: 768px) {
        .recursive-apply-c {
          font-weight: 200;
        }
      }
      .recursive-apply-c {
        font-weight: 700;
      }
      @media (min-width: 1024px) {
        .recursive-apply-c {
          font-weight: 300;
        }
      }
      .use-with-other-properties-base,
      .use-with-other-properties-component {
        color: green;
        font-weight: 700;
      }
      .add-sibling-properties {
        padding: 2rem 1rem;
      }
      .add-sibling-properties:hover {
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }
      @media (min-width: 1024px) {
        .add-sibling-properties {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }
      }
      @media (min-width: 1280px) {
        .add-sibling-properties:focus {
          padding-left: 0.25rem;
          padding-right: 0.25rem;
        }
      }
      .add-sibling-properties {
        color: green;
        padding-top: 3px;
        font-weight: 700;
      }
      h1 {
        font-size: 1.5rem;
        line-height: 2rem;
      }
      @media (min-width: 640px) {
        h1 {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
      }
      @media (min-width: 1024px) {
        h1 {
          font-size: 1.5rem;
          line-height: 2rem;
        }
      }
      h2 {
        font-size: 1.5rem;
        line-height: 2rem;
      }
      @media (min-width: 1024px) {
        h2 {
          font-size: 1.5rem;
          line-height: 2rem;
        }
      }
      @media (min-width: 640px) {
        h2 {
          font-size: 1.5rem;
          line-height: 2rem;
        }
      }
      .important-modifier {
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 0.375rem !important;
      }
      .important-modifier-variant {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      .important-modifier-variant:hover {
        border-radius: 0.375rem !important;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .foo {
        animation: 1s linear infinite spin;
      }
      @keyframes pulse {
        50% {
          opacity: 0.5;
        }
      }
      .bar {
        animation: 2s cubic-bezier(0.4, 0, 0.6, 1) infinite pulse !important;
      }
    `)
  })
})

test('@apply error with unknown utility', async () => {
  let config = {
    darkMode: 'selector',
    content: [{ raw: sharedHtml }],
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
    darkMode: 'selector',
    content: [{ raw: sharedHtml }],
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
    darkMode: 'selector',
    content: [{ raw: sharedHtml }],
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
    darkMode: 'selector',
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
    darkMode: 'selector',
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
    darkMode: 'selector',
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
    darkMode: 'selector',
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
    expect(result.css).toMatchFormattedCss(css`
      .font-bold,
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
        --tw-text-opacity: 1;
        color: rgb(239 68 68 / var(--tw-text-opacity));
        font-weight: 700;
        text-decoration-line: underline;
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
      .font-bold,
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
        --tw-translate-x: -50%;
        --tw-translate-y: -50%;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
        position: absolute;
        top: 50%;
        left: 50%;
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
        --tw-aspect-w: 1;
        position: relative;
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
      .bg-gray-500,
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
      .foo,
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
        color: green;
        font-weight: bold;
      }
      @supports (a: b) {
        .foo {
          color: #00f;
        }
      }
      .bar {
        color: green;
      }
      @supports (a: b) {
        .bar {
          color: #00f;
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
        background-color: #00f;
      }
      .foo {
        color: red;
        background-color: #00f;
        position: absolute;
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
      .b,
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
      .b,
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
        .a,
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
        .a,
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
        .a,
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
      expect(result.css).toMatchFormattedCss(css`
        .a {
          color: red;
          --tw-text-opacity: 1;
          color: rgb(34 197 94 / var(--tw-text-opacity));
          color: #00f;
          text-decoration: underline;
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
        color: #00f;
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
    .foo,
    .bar {
      color: green;
    }
  `)

  result = await run(inputAfter, config)

  expect(result.css).toMatchFormattedCss(css`
    .foo,
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
    #myselector :is(.custom-utility) {
      font-weight: 400;
    }
    #myselector :is(.group:hover .custom-utility) {
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

it('can apply user utilities that start with a dash', async () => {
  let config = {
    content: [{ raw: html`<div class="foo-1 -foo-1 new-class"></div>` }],
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .foo-1 {
        margin: 10px;
      }
      .-foo-1 {
        margin: -15px;
      }
      .new-class {
        @apply -foo-1;
      }
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .foo-1 {
      margin: 10px;
    }
    .-foo-1,
    .new-class {
      margin: -15px;
    }
  `)
})

it('can apply joined classes when using elements', async () => {
  let config = {
    content: [{ raw: html`<div class="foo-1 -foo-1 new-class"></div>` }],
    plugins: [],
  }

  let input = css`
    .foo.bar {
      color: red;
    }
    .bar.foo {
      color: green;
    }
    header:nth-of-type(odd) {
      @apply foo;
    }
    header::after {
      @apply foo;
    }
    main {
      @apply foo bar;
    }
    footer {
      @apply bar;
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .foo.bar {
      color: red;
    }
    .bar.foo {
      color: green;
    }
    header:nth-of-type(2n + 1).bar {
      color: red;
    }
    header.bar:nth-of-type(2n + 1) {
      color: green;
    }
    header.bar:after,
    main.bar,
    main.foo,
    footer.foo {
      color: red;
      color: green;
    }
  `)
})

it('should not replace multiple instances of the same class in a single selector', async () => {
  // NOTE: This test is non-normative and is not part of the spec of how `@apply` works per-se
  // It describes how it currently works because the "correct" way produces a combinatorial explosion
  // of selectors that is not easily doable
  let config = {
    content: [{ raw: html`<div class="foo-1 -foo-1 new-class"></div>` }],
    plugins: [],
  }

  let input = css`
    .foo + .foo {
      color: blue;
    }
    .bar + .bar {
      color: fuchsia;
    }
    header {
      @apply foo;
    }
    main {
      @apply foo bar;
    }
    footer {
      @apply bar;
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .foo + .foo {
      color: #00f;
    }
    .bar + .bar {
      color: #f0f;
    }
    header + .foo,
    main + .foo {
      color: #00f;
    }
    main + .bar,
    footer + .bar {
      color: #f0f;
    }
  `)
})

it('should maintain the correct selector when applying other utilities', () => {
  let config = {
    content: [
      {
        raw: html`
          <div>
            <div class="check"></div>
          </div>
        `,
      },
    ],
  }

  let input = css`
    @tailwind utilities;

    .foo:hover.bar .baz {
      @apply bg-black;
      color: red;
    }

    .foo:hover.bar > .baz {
      @apply bg-black;
      color: red;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo:hover.bar .baz,
      .foo:hover.bar > .baz {
        --tw-bg-opacity: 1;
        background-color: rgb(0 0 0 / var(--tw-bg-opacity));
        color: red;
      }
    `)
  })
})

it('pseudo elements inside apply are moved outside of :is() or :has()', () => {
  let config = {
    darkMode: 'selector',
    content: [
      {
        raw: html` <div class="foo bar baz qux steve bob"></div> `,
      },
    ],
  }

  let input = css`
    .foo::before {
      @apply dark:bg-black/100;
    }

    .bar::before {
      @apply rtl:dark:bg-black/100;
    }

    .baz::before {
      @apply rtl:dark:hover:bg-black/100;
    }

    .qux::file-selector-button {
      @apply rtl:dark:hover:bg-black/100;
    }

    .steve::before {
      @apply rtl:hover:dark:bg-black/100;
    }

    .bob::file-selector-button {
      @apply rtl:hover:dark:bg-black/100;
    }

    .foo::before {
      @apply [:has([dir="rtl"]_&)]:hover:bg-black/100;
    }

    .bar::file-selector-button {
      @apply [:has([dir="rtl"]_&)]:hover:bg-black/100;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .foo:where(.dark, .dark *)::before,
      .bar:where(.dark, .dark *):where([dir='rtl'], [dir='rtl'] *)::before,
      .baz:hover:where(.dark, .dark *):where([dir='rtl'], [dir='rtl'] *)::before {
        background-color: #000;
      }
      .qux:where(.dark, .dark *):where([dir='rtl'], [dir='rtl'] *)::file-selector-button:hover {
        background-color: #000;
      }
      .steve:where(.dark, .dark *):hover:where([dir='rtl'], [dir='rtl'] *):before {
        background-color: #000;
      }
      .bob:where(.dark, .dark *):hover:where([dir='rtl'], [dir='rtl'] *)::file-selector-button {
        background-color: #000;
      }
      :has([dir='rtl'] .foo:hover):before {
        background-color: #000;
      }
      :has([dir='rtl'] .bar)::file-selector-button:hover {
        background-color: #000;
      }
    `)
  })
})

test('::ng-deep, ::deep, ::v-deep pseudo elements are left alone', () => {
  let config = {
    darkMode: 'selector',
    content: [
      {
        raw: html` <div class="foo bar"></div> `,
      },
    ],
  }

  let input = css`
    ::ng-deep .foo .bar {
      @apply font-bold;
    }
    ::v-deep .foo .bar {
      @apply font-bold;
    }
    ::deep .foo .bar {
      @apply font-bold;
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ::ng-deep .foo .bar {
        font-weight: 700;
      }
      ::v-deep .foo .bar {
        font-weight: 700;
      }
      ::deep .foo .bar {
        font-weight: 700;
      }
    `)
  })
})

test('should not break replacing important selector when the same as the parent selector (pseudo)', async () => {
  let config = {
    important: ':root',
    content: [],
  }

  let input = css`
    @tailwind components;
    @layer components {
      :root {
        @apply flex;
      }
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    :root {
      display: flex;
    }
  `)
})

test('should not break replacing important selector when the same as the parent selector (class)', async () => {
  let config = {
    important: '.foo',
    content: [
      {
        raw: html` <div class="foo"></div> `,
      },
    ],
  }

  let input = css`
    @tailwind components;
    @layer components {
      .foo {
        @apply flex;
      }
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .foo {
      display: flex;
    }
  `)
})

test('applying classes with nested CSS should result in an error', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="foo"></div>`,
      },
    ],
  }

  let input = css`
    @tailwind components;
    @layer components {
      .bar .baz {
        color: red;

        &:hover {
          color: red;
        }
      }

      .foo {
        @apply flex baz;
      }
    }
  `

  expect.assertions(1)

  return run(input, config).catch((err) => {
    expect(err.reason).toMatchInlineSnapshot(`
      "The \`baz\` class cannot be used with \`@apply\` because \`@apply\` does not currently support nested CSS.
      Rewrite the selector without nesting or configure the \`tailwindcss/nesting\` plugin:
      https://tailwindcss.com/docs/using-with-preprocessors#nesting"
    `)
  })
})

test('applying user defined classes with nested CSS should result in an error', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="example"></div>`,
      },
    ],
  }

  let input = css`
    .foo {
      .bar {
        color: red;
      }
    }

    .example {
      @apply bar;
    }
  `

  expect.assertions(1)

  return run(input, config).catch((err) => {
    expect(err.reason).toMatchInlineSnapshot(`
      "The \`bar\` class cannot be used with \`@apply\` because \`@apply\` does not currently support nested CSS.
      Rewrite the selector without nesting or configure the \`tailwindcss/nesting\` plugin:
      https://tailwindcss.com/docs/using-with-preprocessors#nesting"
    `)
  })
})

test('applying classes with class-based dark variant to pseudo elements', async () => {
  let config = {
    darkMode: 'class',
    content: [],
  }

  let input = css`
    ::-webkit-scrollbar-track {
      @apply bg-white dark:bg-black;
    }
    ::-webkit-scrollbar-track:hover {
      @apply bg-blue-600 dark:bg-blue-500;
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    ::-webkit-scrollbar-track {
      --tw-bg-opacity: 1;
      background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    }
    :is(.dark *)::-webkit-scrollbar-track {
      --tw-bg-opacity: 1;
      background-color: rgb(0 0 0 / var(--tw-bg-opacity));
    }
    ::-webkit-scrollbar-track:hover {
      --tw-bg-opacity: 1;
      background-color: rgb(37 99 235 / var(--tw-bg-opacity));
    }
    :is(.dark *)::-webkit-scrollbar-track:hover {
      --tw-bg-opacity: 1;
      background-color: rgb(59 130 246 / var(--tw-bg-opacity));
    }
  `)
})
