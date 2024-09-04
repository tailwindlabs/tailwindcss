import { run, html, css, defaults } from './util/run'

test('it works', () => {
  let config = {
    darkMode: 'selector',
    content: [
      {
        raw: html`
          <div
            class="line-clamp-2 line-clamp-[33] line-clamp-[var(--line-clamp-variable)] line-clamp-none"
          ></div>
          <div class="range:text-right multi:text-left"></div>
          <div
            class="container hover:container sm:container md:container text-center sm:text-center md:text-center"
          ></div>
          <div class="grid-cols-[200px,repeat(auto-fill,minmax(15%,100px)),300px]"></div>
          <div class="test-apply-font-variant"></div>
          <div class="mt-6 mx-1 ms-4 me-8"></div>
          <div class="pt-6 px-1 ps-4 pe-8"></div>
          <div class="inset-6 inset-x-1 start-4 end-8"></div>
          <div class="border-2 border-s-0 border-e-4"></div>
          <div class="border-black border-s-green-500 border-e-red-400"></div>
          <div class="rounded-s rounded-e rounded-ss rounded-es"></div>
          <div class="bg-black"></div>
          <div class="md:hover:border-r-blue-500/30"></div>
          <div class="custom-util"></div>
          <div class="hover:custom-util"></div>
          <div class="group-hover:custom-util"></div>
          <div class="foo:custom-util"></div>
          <div class="foo:hover:custom-util"></div>
          <div class="sm:custom-util"></div>
          <div class="dark:custom-util"></div>
          <div class="motion-safe:custom-util"></div>
          <div class="md:dark:motion-safe:foo:active:custom-util"></div>
          <div class="aspect-w-1 aspect-h-2"></div>
          <div class="aspect-w-3 aspect-h-4"></div>
          <div class="magic-none magic-tons"></div>
          <div class="focus:font-normal"></div>
          <div class="font-medium"></div>
          <div class="bg-gradient-to-r from-foo"></div>
          <div class="custom-component custom-util"></div>
          <div class="bg-opacity-50"></div>
          <div class="focus:ring-2 focus:ring-blue-500"></div>
          <div class="hover:font-bold"></div>
          <div class="disabled:font-bold"></div>
          <div class="focus:hover:font-light"></div>
          <div class="first:pt-0"></div>
          <div class="container"></div>
          <div class="bg-hero--home-1"></div>
          <div class="group-hover:opacity-100"></div>
          <div class="group-active:opacity-10"></div>
          <div class="sm:motion-safe:group-active:focus:opacity-10"></div>
          <div class="motion-safe:transition"></div>
          <div class="motion-reduce:transition"></div>
          <div class="md:motion-safe:hover:transition"></div>
          <div class="md:sm:text-center shadow-sm md:shadow-sm"></div>
          <div class="md:sm:text-center shadow-sm md:shadow-sm"></div>
          <div class="bg-green-500 md:opacity-50 md:hover:opacity-20 sm:tabular-nums"></div>
          <div
            class="text-center shadow-md hover:shadow-lg transform scale-50 hover:scale-75"
          ></div>

          <script>
            defineComponent({
              name: 'HelloWorld',
              props: {
                msg: {
                  type: String,
                  required: true,
                },
                things: Array /* PropType<string[]> */,
              },
              setup: () => {
                const count = ref(0)
                // Weird regex-looking stuff that once caused a stack overflow in candidatePermutations
                const pattern = ' ]-[] '
                return {
                  count,
                  stuff: [] /* string[] | undefined */,
                }
              },
            })
          </script>
        `,
      },
    ],
    corePlugins: { preflight: false },
    theme: {
      extend: {
        screens: {
          range: { min: '1280px', max: '1535px' },
          multi: [{ min: '640px', max: '767px' }, { max: '868px' }],
        },
        gradientColorStops: {
          foo: '#bada55',
        },
        backgroundImage: {
          'hero--home-1': "url('/images/homepage-1.jpg')",
        },
      },
    },
    plugins: [
      function ({ addVariant }) {
        addVariant(
          'foo',
          ({ container }) => {
            container.walkRules((rule) => {
              rule.selector = `.foo\\:${rule.selector.slice(1)}`
              rule.walkDecls((decl) => {
                decl.important = true
              })
            })
          },
          { before: 'sm' }
        )
      },
      function ({ addUtilities, addBase, theme }) {
        addBase({
          h1: {
            fontSize: theme('fontSize.2xl'),
            fontWeight: theme('fontWeight.bold'),
            '&:first-child': {
              marginTop: '0px',
            },
          },
        })
        addUtilities(
          {
            '.magic-none': {
              magic: 'none',
            },
            '.magic-tons': {
              magic: 'tons',
            },
          },
          ['responsive', 'hover']
        )
      },
    ],
  }

  let input = css`
    @layer utilities {
      .custom-util {
        background: #abcdef;
      }
      *,
      ::before,
      ::after,
      ::backdrop {
        margin: 10px;
      }
    }
    @layer components {
      .test-apply-font-variant {
        @apply ordinal tabular-nums;
      }
      .custom-component {
        background: #123456;
      }
      *,
      ::before,
      ::after,
      ::backdrop {
        padding: 5px;
      }
      .foo .bg-black {
        appearance: none;
      }
    }
    @layer base {
      div {
        background: #654321;
      }
    }
    .theme-test {
      font-family: theme('fontFamily.sans');
      color: theme('colors.blue.500');
    }
    @screen lg {
      .screen-test {
        color: purple;
      }
    }
    .apply-1 {
      @apply mt-6;
    }
    .apply-2 {
      @apply mt-6;
    }
    .apply-test {
      @apply mt-6 bg-pink-500 hover:font-bold focus:hover:font-bold sm:bg-green-500 sm:focus:even:bg-pink-200;
    }
    .apply-components {
      @apply container mx-auto;
    }
    .drop-empty-rules {
      @apply hover:font-bold;
    }
    .apply-group {
      @apply group-hover:font-bold;
    }
    .apply-dark-mode {
      @apply dark:font-bold;
    }
    .apply-with-existing:hover {
      @apply font-normal sm:bg-green-500;
    }
    .multiple,
    .selectors {
      @apply font-bold group-hover:font-normal;
    }
    .list {
      @apply space-y-4;
    }
    .nested {
      .example {
        @apply font-bold hover:font-normal;
      }
    }
    .apply-order-a {
      @apply m-5 mt-6;
    }
    .apply-order-b {
      @apply m-5 mt-6;
    }
    .apply-dark-group-example-a {
      @apply dark:group-hover:bg-green-500;
    }
    .crazy-example {
      @apply sm:motion-safe:group-active:focus:opacity-10;
    }
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .theme-test {
        color: #3b82f6;
        font-family: ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji,
          Segoe UI Symbol, Noto Color Emoji;
      }
      @media (min-width: 1024px) {
        .screen-test {
          color: purple;
        }
      }
      .apply-1,
      .apply-2 {
        margin-top: 1.5rem;
      }
      .apply-test {
        --tw-bg-opacity: 1;
        background-color: rgb(236 72 153 / var(--tw-bg-opacity));
        margin-top: 1.5rem;
      }
      .apply-test:hover,
      .apply-test:hover:focus {
        font-weight: 700;
      }
      @media (min-width: 640px) {
        .apply-test {
          --tw-bg-opacity: 1;
          background-color: rgb(34 197 94 / var(--tw-bg-opacity));
        }
        .apply-test:nth-child(2n):focus {
          --tw-bg-opacity: 1;
          background-color: rgb(251 207 232 / var(--tw-bg-opacity));
        }
      }
      .apply-components {
        width: 100%;
      }
      @media (min-width: 640px) {
        .apply-components {
          max-width: 640px;
        }
      }
      @media (min-width: 768px) {
        .apply-components {
          max-width: 768px;
        }
      }
      @media (min-width: 1024px) {
        .apply-components {
          max-width: 1024px;
        }
      }
      @media (min-width: 1280px) {
        .apply-components {
          max-width: 1280px;
        }
      }
      @media (min-width: 1536px) {
        .apply-components {
          max-width: 1536px;
        }
      }
      .apply-components {
        margin-left: auto;
        margin-right: auto;
      }
      .drop-empty-rules:hover,
      .group:hover .apply-group {
        font-weight: 700;
      }
      .apply-dark-mode:where(.dark, .dark *) {
        font-weight: 700;
      }
      .apply-with-existing:hover {
        font-weight: 400;
      }
      @media (min-width: 640px) {
        .apply-with-existing:hover {
          --tw-bg-opacity: 1;
          background-color: rgb(34 197 94 / var(--tw-bg-opacity));
        }
      }
      .multiple,
      .selectors {
        font-weight: 700;
      }
      .group:hover .multiple,
      .group:hover .selectors {
        font-weight: 400;
      }
      .list > :not([hidden]) ~ :not([hidden]) {
        --tw-space-y-reverse: 0;
        margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
        margin-bottom: calc(1rem * var(--tw-space-y-reverse));
      }
      .nested .example {
        font-weight: 700;
      }
      .nested .example:hover {
        font-weight: 400;
      }
      .apply-order-a,
      .apply-order-b {
        margin: 1.5rem 1.25rem 1.25rem;
      }
      .group:hover .apply-dark-group-example-a:where(.dark, .dark *) {
        --tw-bg-opacity: 1;
        background-color: rgb(34 197 94 / var(--tw-bg-opacity));
      }
      @media (min-width: 640px) {
        @media (prefers-reduced-motion: no-preference) {
          .group:active .crazy-example:focus {
            opacity: 0.1;
          }
        }
      }
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
      }
      h1:first-child {
        margin-top: 0;
      }
      div {
        background: #654321;
      }
      ${defaults}
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
      .test-apply-font-variant {
        --tw-ordinal: ordinal;
        --tw-numeric-spacing: tabular-nums;
        font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure)
          var(--tw-numeric-spacing) var(--tw-numeric-fraction);
      }
      .custom-component {
        background: #123456;
      }
      *,
      :before,
      :after,
      ::backdrop {
        padding: 5px;
      }
      .foo .bg-black {
        appearance: none;
      }
      .inset-6 {
        inset: 1.5rem;
      }
      .inset-x-1 {
        left: 0.25rem;
        right: 0.25rem;
      }
      .end-8 {
        inset-inline-end: 2rem;
      }
      .start-4 {
        inset-inline-start: 1rem;
      }
      .mx-1 {
        margin-left: 0.25rem;
        margin-right: 0.25rem;
      }
      .me-8 {
        margin-inline-end: 2rem;
      }
      .ms-4 {
        margin-inline-start: 1rem;
      }
      .mt-6 {
        margin-top: 1.5rem;
      }
      .line-clamp-2 {
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }
      .line-clamp-\[33\] {
        -webkit-line-clamp: 33;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }
      .line-clamp-\[var\(--line-clamp-variable\)\] {
        -webkit-line-clamp: var(--line-clamp-variable);
        -webkit-box-orient: vertical;
        display: -webkit-box;
        overflow: hidden;
      }
      .line-clamp-none {
        -webkit-line-clamp: none;
        -webkit-box-orient: horizontal;
        display: block;
        overflow: visible;
      }
      .scale-50 {
        --tw-scale-x: 0.5;
        --tw-scale-y: 0.5;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .transform {
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .grid-cols-\[200px\,repeat\(auto-fill\,minmax\(15\%\,100px\)\)\,300px\] {
        grid-template-columns: 200px repeat(auto-fill, minmax(15%, 100px)) 300px;
      }
      .rounded-e {
        border-start-end-radius: 0.25rem;
        border-end-end-radius: 0.25rem;
      }
      .rounded-s {
        border-start-start-radius: 0.25rem;
        border-end-start-radius: 0.25rem;
      }
      .rounded-es {
        border-end-start-radius: 0.25rem;
      }
      .rounded-ss {
        border-start-start-radius: 0.25rem;
      }
      .border-2 {
        border-width: 2px;
      }
      .border-e-4 {
        border-inline-end-width: 4px;
      }
      .border-s-0 {
        border-inline-start-width: 0;
      }
      .border-black {
        --tw-border-opacity: 1;
        border-color: rgb(0 0 0 / var(--tw-border-opacity));
      }
      .border-e-red-400 {
        --tw-border-opacity: 1;
        border-inline-end-color: rgb(248 113 113 / var(--tw-border-opacity));
      }
      .border-s-green-500 {
        --tw-border-opacity: 1;
        border-inline-start-color: rgb(34 197 94 / var(--tw-border-opacity));
      }
      .bg-black {
        --tw-bg-opacity: 1;
        background-color: rgb(0 0 0 / var(--tw-bg-opacity));
      }
      .bg-green-500 {
        --tw-bg-opacity: 1;
        background-color: rgb(34 197 94 / var(--tw-bg-opacity));
      }
      .bg-opacity-50 {
        --tw-bg-opacity: 0.5;
      }
      .bg-gradient-to-r {
        background-image: linear-gradient(to right, var(--tw-gradient-stops));
      }
      .bg-hero--home-1 {
        background-image: url('/images/homepage-1.jpg');
      }
      .from-foo {
        --tw-gradient-from: #bada55 var(--tw-gradient-from-position);
        --tw-gradient-to: #bada5500 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .px-1 {
        padding-left: 0.25rem;
        padding-right: 0.25rem;
      }
      .pe-8 {
        padding-inline-end: 2rem;
      }
      .ps-4 {
        padding-inline-start: 1rem;
      }
      .pt-6 {
        padding-top: 1.5rem;
      }
      .text-center {
        text-align: center;
      }
      .font-medium {
        font-weight: 500;
      }
      .shadow-md {
        --tw-shadow: 0 4px 6px -1px #0000001a, 0 2px 4px -2px #0000001a;
        --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color),
          0 2px 4px -2px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      .shadow-sm {
        --tw-shadow: 0 1px 2px 0 #0000000d;
        --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      .magic-none {
        magic: none;
      }
      .magic-tons {
        magic: tons;
      }
      .custom-util {
        background: #abcdef;
      }
      *,
      :before,
      :after,
      ::backdrop {
        margin: 10px;
      }
      .hover\:container:hover {
        width: 100%;
      }
      @media (min-width: 640px) {
        .hover\:container:hover {
          max-width: 640px;
        }
      }
      @media (min-width: 768px) {
        .hover\:container:hover {
          max-width: 768px;
        }
      }
      @media (min-width: 1024px) {
        .hover\:container:hover {
          max-width: 1024px;
        }
      }
      @media (min-width: 1280px) {
        .hover\:container:hover {
          max-width: 1280px;
        }
      }
      @media (min-width: 1536px) {
        .hover\:container:hover {
          max-width: 1536px;
        }
      }
      @media (min-width: 640px) {
        .sm\:container {
          width: 100%;
        }
        @media (min-width: 640px) {
          .sm\:container {
            max-width: 640px;
          }
        }
        @media (min-width: 768px) {
          .sm\:container {
            max-width: 768px;
          }
        }
        @media (min-width: 1024px) {
          .sm\:container {
            max-width: 1024px;
          }
        }
        @media (min-width: 1280px) {
          .sm\:container {
            max-width: 1280px;
          }
        }
        @media (min-width: 1536px) {
          .sm\:container {
            max-width: 1536px;
          }
        }
      }
      @media (min-width: 768px) {
        .md\:container {
          width: 100%;
        }
        @media (min-width: 640px) {
          .md\:container {
            max-width: 640px;
          }
        }
        @media (min-width: 768px) {
          .md\:container {
            max-width: 768px;
          }
        }
        @media (min-width: 1024px) {
          .md\:container {
            max-width: 1024px;
          }
        }
        @media (min-width: 1280px) {
          .md\:container {
            max-width: 1280px;
          }
        }
        @media (min-width: 1536px) {
          .md\:container {
            max-width: 1536px;
          }
        }
      }
      .first\:pt-0:first-child {
        padding-top: 0;
      }
      .hover\:scale-75:hover {
        --tw-scale-x: 0.75;
        --tw-scale-y: 0.75;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .hover\:font-bold:hover {
        font-weight: 700;
      }
      .hover\:shadow-lg:hover {
        --tw-shadow: 0 10px 15px -3px #0000001a, 0 4px 6px -4px #0000001a;
        --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
          0 4px 6px -4px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      .hover\:custom-util:hover {
        background: #abcdef;
      }
      .focus\:font-normal:focus {
        font-weight: 400;
      }
      .focus\:ring-2:focus {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
      .focus\:ring-blue-500:focus {
        --tw-ring-opacity: 1;
        --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
      }
      .focus\:hover\:font-light:hover:focus {
        font-weight: 300;
      }
      .disabled\:font-bold:disabled {
        font-weight: 700;
      }
      .group:hover .group-hover\:opacity-100 {
        opacity: 1;
      }
      .group:hover .group-hover\:custom-util {
        background: #abcdef;
      }
      .group:active .group-active\:opacity-10 {
        opacity: 0.1;
      }
      .foo\:custom-util,
      .foo\:hover\:custom-util:hover {
        background: #abcdef !important;
      }
      @media (prefers-reduced-motion: no-preference) {
        .motion-safe\:transition {
          transition-property: color, background-color, border-color, text-decoration-color, fill,
            stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-duration: 0.15s;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .motion-safe\:custom-util {
          background: #abcdef;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .motion-reduce\:transition {
          transition-property: color, background-color, border-color, text-decoration-color, fill,
            stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-duration: 0.15s;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
      @media (min-width: 640px) {
        .sm\:text-center {
          text-align: center;
        }
        .sm\:tabular-nums {
          --tw-numeric-spacing: tabular-nums;
          font-variant-numeric: var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure)
            var(--tw-numeric-spacing) var(--tw-numeric-fraction);
        }
        .sm\:custom-util {
          background: #abcdef;
        }
        @media (prefers-reduced-motion: no-preference) {
          .group:active .sm\:motion-safe\:group-active\:focus\:opacity-10:focus {
            opacity: 0.1;
          }
        }
      }
      @media (min-width: 768px) {
        .md\:text-center {
          text-align: center;
        }
        .md\:opacity-50 {
          opacity: 0.5;
        }
        .md\:shadow-sm {
          --tw-shadow: 0 1px 2px 0 #0000000d;
          --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
          box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
            var(--tw-shadow);
        }
        .md\:hover\:border-r-blue-500\/30:hover {
          border-right-color: #3b82f64d;
        }
        .md\:hover\:opacity-20:hover {
          opacity: 0.2;
        }
        @media (prefers-reduced-motion: no-preference) {
          .md\:motion-safe\:hover\:transition:hover {
            transition-property: color, background-color, border-color, text-decoration-color, fill,
              stroke, opacity, box-shadow, transform, filter, backdrop-filter;
            transition-duration: 0.15s;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
        @media (min-width: 640px) {
          .md\:sm\:text-center {
            text-align: center;
          }
        }
      }
      @media (min-width: 1280px) and (max-width: 1535px) {
        .range\:text-right {
          text-align: right;
        }
      }
      @media (min-width: 640px) and (max-width: 767px), (max-width: 868px) {
        .multi\:text-left {
          text-align: left;
        }
      }
      .dark\:custom-util:where(.dark, .dark *) {
        background: #abcdef;
      }
      @media (min-width: 768px) {
        @media (prefers-reduced-motion: no-preference) {
          .md\:dark\:motion-safe\:foo\:active\:custom-util:active:where(.dark, .dark *) {
            background: #abcdef !important;
          }
        }
      }
    `)
  })
})
