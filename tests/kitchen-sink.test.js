import fs from 'fs'
import path from 'path'

import { run, css } from './util/run'

test('it works', () => {
  let config = {
    darkMode: 'class',
    content: [path.resolve(__dirname, './kitchen-sink.test.html')],
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
      @apply space-x-4;
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
    let expectedPath = path.resolve(__dirname, './kitchen-sink.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
