import { crosscheck, run, html, css, defaults } from './util/run'

crosscheck(({ stable, oxide }) => {
  it('should be possible to use contrast-more and contrast-less variants', () => {
    let config = {
      content: [
        {
          raw: html`<div class="bg-white contrast-more:bg-pink-500 contrast-less:bg-black"></div>`,
        },
      ],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      stable.expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        .bg-white {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
        }
        @media (prefers-contrast: more) {
          .contrast-more\:bg-pink-500 {
            --tw-bg-opacity: 1;
            background-color: rgb(236 72 153 / var(--tw-bg-opacity));
          }
        }
        @media (prefers-contrast: less) {
          .contrast-less\:bg-black {
            --tw-bg-opacity: 1;
            background-color: rgb(0 0 0 / var(--tw-bg-opacity));
          }
        }
      `)
      oxide.expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        .bg-white {
          background-color: #fff;
        }
        @media (prefers-contrast: more) {
          .contrast-more\:bg-pink-500 {
            background-color: #ec4899;
          }
        }
        @media (prefers-contrast: less) {
          .contrast-less\:bg-black {
            background-color: #000;
          }
        }
      `)
    })
  })

  it('dark mode should appear after the contrast variants', () => {
    let config = {
      content: [{ raw: html`<div class="contrast-more:bg-black dark:bg-white"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      stable.expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        @media (prefers-contrast: more) {
          .contrast-more\:bg-black {
            --tw-bg-opacity: 1;
            background-color: rgb(0 0 0 / var(--tw-bg-opacity));
          }
        }
        @media (prefers-color-scheme: dark) {
          .dark\:bg-white {
            --tw-bg-opacity: 1;
            background-color: rgb(255 255 255 / var(--tw-bg-opacity));
          }
        }
      `)
      oxide.expect(result.css).toMatchFormattedCss(css`
        ${defaults}
        @media (prefers-contrast: more) {
          .contrast-more\:bg-black {
            background-color: #000;
          }
        }
        @media (prefers-color-scheme: dark) {
          .dark\:bg-white {
            background-color: #fff;
          }
        }
      `)
    })
  })
})
