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

test('font-size utilities can include a line-height modifier', () => {
  let config = {
    content: [
      {
        raw: html`<div class="text-sm md:text-base">
          <div class="text-sm/6 md:text-base/7"></div>
          <div class="text-sm/[21px] md:text-base/[33px]"></div>
          <div class="text-[13px]/6 md:text-[19px]/8"></div>
          <div class="text-[17px]/[23px] md:text-[21px]/[29px]"></div>
          <div class="text-sm/999 md:text-base/000"></div>
        </div>`,
      },
    ],
    theme: {
      fontSize: {
        sm: ['12px', '20px'],
        base: ['16px', '24px'],
      },
      lineHeight: {
        6: '24px',
        7: '28px',
        8: '32px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchCss(css`
      .text-\[13px\]\/6 {
        font-size: 13px;
        line-height: 24px;
      }
      .text-\[17px\]\/\[23px\] {
        font-size: 17px;
        line-height: 23px;
      }
      .text-sm {
        font-size: 12px;
        line-height: 20px;
      }
      .text-sm\/6 {
        font-size: 12px;
        line-height: 24px;
      }
      .text-sm\/\[21px\] {
        font-size: 12px;
        line-height: 21px;
      }
      @media (min-width: 768px) {
        .md\:text-\[19px\]\/8 {
          font-size: 19px;
          line-height: 32px;
        }
        .md\:text-\[21px\]\/\[29px\] {
          font-size: 21px;
          line-height: 29px;
        }
        .md\:text-base {
          font-size: 16px;
          line-height: 24px;
        }
        .md\:text-base\/7 {
          font-size: 16px;
          line-height: 28px;
        }
        .md\:text-base\/\[33px\] {
          font-size: 16px;
          line-height: 33px;
        }
      }
    `)
  })
})
