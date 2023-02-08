import { crosscheck, run, html, css } from '../util/run'

crosscheck(() => {
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
        .text-lg {
          font-size: 20px;
          line-height: 28px;
        }
        .text-md {
          font-size: 16px;
          line-height: 24px;
        }
        .text-sm {
          font-size: 12px;
        }
      `)
    })
  })

  test('font-size utilities can include a default letter-spacing', () => {
    let config = {
      content: [{ raw: html`<div class="text-md text-sm text-lg"></div>` }],
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
        .text-lg {
          letter-spacing: -0.02em;
          font-size: 20px;
        }
        .text-md {
          letter-spacing: -0.01em;
          font-size: 16px;
        }
        .text-sm {
          font-size: 12px;
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
        .text-lg {
          letter-spacing: -0.02em;
          font-size: 20px;
          line-height: 28px;
        }
        .text-md {
          letter-spacing: -0.01em;
          font-size: 16px;
          line-height: 24px;
        }
        .text-sm {
          font-size: 12px;
        }
      `)
    })
  })

  test('font-size utilities can include a font-weight', () => {
    let config = {
      content: [{ raw: html`<div class="text-md text-sm text-lg"></div>` }],
      theme: {
        fontSize: {
          sm: '12px',
          md: ['16px', { lineHeight: '24px', fontWeight: 500 }],
          lg: ['20px', { lineHeight: '28px', fontWeight: 'bold' }],
        },
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchCss(css`
        .text-lg {
          font-size: 20px;
          font-weight: bold;
          line-height: 28px;
        }
        .text-md {
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
        }
        .text-sm {
          font-size: 12px;
        }
      `)
    })
  })
})
