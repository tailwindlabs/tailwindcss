import { run, html, css } from '../util/run'

test('font-size utilities can include a default line-height', () => {
  let config = {
    content: [{ raw: html`<div class="text-md text-sm text-lg"></div>` }],
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
      .text-md {
        font-size: 16px;
        line-height: 24px;
      }
      .text-sm {
        font-size: 12px;
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
    content: [{ raw: html`<div class="text-md text-sm text-lg text-xl"></div>` }],
    theme: {
      fontSize: {
        sm: '12px',
        md: ['16px', { letterSpacing: '-0.01em' }],
        lg: ['20px', { letterSpacing: '-0.02em', fontWeight: 500 }],
        xl: ['24px', { letterSpacing: '-0.03em', fontWeight: 'bold' }],
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .text-md {
        font-size: 16px;
        letter-spacing: -0.01em;
      }
      .text-sm {
        font-size: 12px;
      }
      .text-lg {
        font-size: 20px;
        letter-spacing: -0.02em;
        font-weight: 500;
      }
      .text-xl {
        font-size: 24px;
        letter-spacing: -0.03em;
        font-weight: bold;
      }
    `)
  })
})

test('font-size utilities can include a default line-height and letter-spacing', () => {
  let config = {
    content: [{ raw: html`<div class="text-md text-sm text-lg"></div>` }],
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
      .text-md {
        font-size: 16px;
        line-height: 24px;
        letter-spacing: -0.01em;
      }
      .text-sm {
        font-size: 12px;
      }
      .text-lg {
        font-size: 20px;
        line-height: 28px;
        letter-spacing: -0.02em;
      }
    `)
  })
})
