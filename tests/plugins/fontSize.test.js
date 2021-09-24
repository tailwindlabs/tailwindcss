import { run, html, css } from '../util/run'

test('font-size utilities can include a default line-height', () => {
  let config = {
    content: [{ raw: html`<div class="text-sm text-md text-lg"></div>` }],
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', '24px'],
        lg: ['20px', '28px'],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .text-sm {
        font-size: 12px;
      }
      .text-md {
        font-size: 16px;
        line-height: 24px;
      }
      .text-lg {
        font-size: 20px;
        line-height: 28px;
      }
    `)
  })
})

test('font-size utilities can include a default letter-spacing', () => {
  let config = {
    content: [{ raw: html`<div class="text-sm text-md text-lg"></div>` }],
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', { letterSpacing: '-0.01em' }],
        lg: ['20px', { letterSpacing: '-0.02em' }],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .text-sm {
        font-size: 12px;
      }
      .text-md {
        font-size: 16px;
        letter-spacing: -0.01em;
      }
      .text-lg {
        font-size: 20px;
        letter-spacing: -0.02em;
      }
    `)
  })
})

test('font-size utilities can include a default line-height and letter-spacing', () => {
  let config = {
    content: [{ raw: html`<div class="text-sm text-md text-lg"></div>` }],
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        lg: ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .text-sm {
        font-size: 12px;
      }
      .text-md {
        font-size: 16px;
        line-height: 24px;
        letter-spacing: -0.01em;
      }
      .text-lg {
        font-size: 20px;
        line-height: 28px;
        letter-spacing: -0.02em;
      }
    `)
  })
})
