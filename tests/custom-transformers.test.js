import { run, html, css } from './util/run'

function customTransformer(content) {
  return content.replace(/uppercase/g, 'lowercase')
}

test('transform function', () => {
  let config = {
    content: {
      content: [{ raw: html`<div class="uppercase"></div>` }],
      transform: customTransformer,
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})

test('transform.DEFAULT', () => {
  let config = {
    content: {
      content: [{ raw: html`<div class="uppercase"></div>` }],
      transform: {
        DEFAULT: customTransformer,
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})

test('transform.{extension}', () => {
  let config = {
    content: {
      content: [
        { raw: html`<div class="uppercase"></div>`, extension: 'html' },
        { raw: html`<div class="uppercase"></div>`, extension: 'php' },
      ],
      transform: {
        html: customTransformer,
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .uppercase {
        text-transform: uppercase;
      }
      .lowercase {
        text-transform: lowercase;
      }
    `)
  })
})
