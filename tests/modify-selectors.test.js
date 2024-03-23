import selectorParser from 'postcss-selector-parser'

import { run, html, css } from './util/run'

test('modify selectors', () => {
  let config = {
    darkMode: 'selector',
    content: [
      {
        raw: html`
          <div class="font-bold"></div>
          <div class="foo:font-bold"></div>
          <div class="foo:hover:font-bold"></div>
          <div class="sm:foo:font-bold"></div>
          <div class="md:foo:focus:font-bold"></div>
          <div class="markdown">
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
          <div class="foo:markdown">
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
          <div class="foo:visited:markdown">
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
          <div class="lg:foo:disabled:markdown">
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
        `,
      },
    ],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [
      function ({ addVariant }) {
        addVariant('foo', ({ modifySelectors, separator }) => {
          modifySelectors(({ selector }) => {
            return selectorParser((selectors) => {
              selectors.walkClasses((classNode) => {
                classNode.value = `foo${separator}${classNode.value}`
                classNode.parent.insertBefore(classNode, selectorParser().astSync(`.foo `))
              })
            }).processSync(selector)
          })
        })
      },
    ],
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer components {
      .markdown > p {
        margin-top: 12px;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .markdown > p {
        margin-top: 12px;
      }
      .font-bold {
        font-weight: 700;
      }
      .foo .foo\:markdown > p,
      .foo .foo\:visited\:markdown:visited > p {
        margin-top: 12px;
      }
      @media (min-width: 1024px) {
        .foo .lg\:foo\:disabled\:markdown:disabled > p {
          margin-top: 12px;
        }
      }
      .foo .foo\:font-bold,
      .foo .foo\:hover\:font-bold:hover {
        font-weight: 700;
      }
      @media (min-width: 640px) {
        .foo .sm\:foo\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 768px) {
        .foo .md\:foo\:focus\:font-bold:focus {
          font-weight: 700;
        }
      }
    `)
  })
})
