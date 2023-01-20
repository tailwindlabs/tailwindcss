import { crosscheck, run, html, css } from './util/run'

function customExtractor(content) {
  let matches = content.match(/class="([^"]+)"/)
  return matches ? matches[1].split(/\s+/) : []
}

let sharedHtml = html`
  <div class="text-indigo-500 bg-white">hello world</div>
  <span>text-red-500 shouldn't appear in the output</span>
`

let expected = css`
  .bg-white {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  }
  .text-indigo-500 {
    --tw-text-opacity: 1;
    color: rgb(99 102 241 / var(--tw-text-opacity));
  }
`

crosscheck(({ stable, oxide }) => {
  describe('modern', () => {
    oxide.test.todo('extract.DEFAULT')
    stable.test('extract.DEFAULT', () => {
      let config = {
        content: {
          files: [{ raw: sharedHtml }],
          extract: {
            DEFAULT: customExtractor,
          },
        },
      }

      return run('@tailwind utilities', config).then((result) => {
        expect(result.css).toMatchFormattedCss(expected)
      })
    })

    oxide.test.todo('extract.{extension}')
    stable.test('extract.{extension}', () => {
      let config = {
        content: {
          files: [{ raw: sharedHtml }],
          extract: {
            html: customExtractor,
          },
        },
      }

      return run('@tailwind utilities', config).then((result) => {
        expect(result.css).toMatchFormattedCss(expected)
      })
    })

    oxide.test.todo('extract function')
    stable.test('extract function', () => {
      let config = {
        content: {
          files: [{ raw: sharedHtml }],
          extract: customExtractor,
        },
      }

      return run('@tailwind utilities', config).then((result) => {
        expect(result.css).toMatchFormattedCss(expected)
      })
    })

    oxide.test.todo('raw content with extension')
    stable.test('raw content with extension', () => {
      let config = {
        content: {
          files: [
            {
              raw: sharedHtml,
              extension: 'html',
            },
          ],
          extract: {
            html: () => ['invisible'],
          },
        },
        corePlugins: { preflight: false },
      }

      return run('@tailwind utilities', config).then((result) => {
        expect(result.css).toMatchFormattedCss(css`
          .invisible {
            visibility: hidden;
          }
        `)
      })
    })
  })

  describe('legacy', () => {
    oxide.test.todo('defaultExtractor')
    stable.test('defaultExtractor', () => {
      let config = {
        content: {
          files: [{ raw: sharedHtml }],
          options: {
            defaultExtractor: customExtractor,
          },
        },
      }

      return run('@tailwind utilities', config).then((result) => {
        expect(result.css).toMatchFormattedCss(expected)
      })
    })

    oxide.test.todo('extractors array')
    stable.test('extractors array', () => {
      let config = {
        content: {
          files: [{ raw: sharedHtml }],
          options: {
            extractors: [
              {
                extractor: customExtractor,
                extensions: ['html'],
              },
            ],
          },
        },
      }

      return run('@tailwind utilities', config).then((result) => {
        expect(result.css).toMatchFormattedCss(expected)
      })
    })
  })
})
