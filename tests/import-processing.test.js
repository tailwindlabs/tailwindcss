import { html, css, run } from './util/run'

describe('import processing', () => {
  it('should be possible to import another css file', async () => {
    let config = {
      darkMode: 'class',
      content: [
        {
          raw: html`<div class="underline" />`,
        },
      ],
      corePlugins: { preflight: false },
    }

    let input = css`
      @import './import-processing-a.css';
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .underline {
        text-decoration-line: underline;
      }
    `)
  })

  it('should be possible to import another css file after @tailwind directive', async () => {
    let config = {
      darkMode: 'class',
      content: [
        {
          raw: html`<div class="foo underline" />`,
        },
      ],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;

      @import './import-processing-b.css';
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .underline {
        text-decoration-line: underline;
      }

      .foo {
        color: red;
      }
    `)
  })

  it('should be possible to add @config before @import statements', async () => {
    let input = css`
      @config "./import-processing-c.js";
      @import './import-processing-c.css';
    `

    let result = await run(input)

    expect(result.css).toMatchFormattedCss(css`
      .underline {
        text-decoration-line: underline;
      }

      .foo {
        color: red;
      }
    `)
  })
})
