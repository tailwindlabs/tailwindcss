import { run, html, css } from './util/run'

test('using a negative prefix with a negative scale value', () => {
  let config = {
    content: [{ raw: html`<div class="mt-2 -mt-2"></div>` }],
    theme: {
      margin: {
        2: '8px',
        '-2': '-4px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .mt-2 {
        margin-top: 8px;
      }
      .-mt-2 {
        margin-top: -4px;
      }
    `)
  })
})

test('using a negative scale value with a plugin that does not support dynamic negative values', () => {
  let config = {
    content: [{ raw: html`<div class="-opacity-50"></div>` }],
    theme: {
      opacity: {
        '-50': '0.5',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .-opacity-50 {
        opacity: 0.5;
      }
    `)
  })
})

test('using a negative prefix without a negative scale value', () => {
  let config = {
    content: [{ raw: html`<div class="mt-5 -mt-5"></div>` }],
    theme: {
      margin: {
        5: '20px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .mt-5 {
        margin-top: 20px;
      }
      .-mt-5 {
        margin-top: -20px;
      }
    `)
  })
})

test('being an asshole', () => {
  let config = {
    content: [{ raw: html`<div class="-mt-[10px]"></div>` }],
    theme: {
      margin: {
        '-[10px]': '55px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .-mt-\[10px\] {
        margin-top: 55px;
      }
    `)
  })
})

test('being a real asshole', () => {
  let config = {
    content: [{ raw: html`<div class="-mt-[10px]"></div>` }],
    theme: {
      margin: {
        '[10px]': '55px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .-mt-\[10px\] {
        margin-top: -55px;
      }
    `)
  })
})

test('a value that includes a variable', () => {
  let config = {
    content: [{ raw: html`<div class="mt-5 -mt-5"></div>` }],
    theme: {
      margin: {
        5: 'var(--sizing-5)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .mt-5 {
        margin-top: var(--sizing-5);
      }
      .-mt-5 {
        margin-top: calc(var(--sizing-5) * -1);
      }
    `)
  })
})

test('a value that includes a calc', () => {
  let config = {
    content: [{ raw: html`<div class="mt-5 -mt-5"></div>` }],
    theme: {
      margin: {
        5: 'calc(52px * -3)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .mt-5 {
        margin-top: calc(52px * -3);
      }
      .-mt-5 {
        margin-top: calc(calc(52px * -3) * -1);
      }
    `)
  })
})

test('a keyword value', () => {
  let config = {
    content: [{ raw: html`<div class="-mt-auto mt-auto"></div>` }],
    theme: {
      margin: {
        auto: 'auto',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .mt-auto {
        margin-top: auto;
      }
    `)
  })
})

test('a zero value', () => {
  let config = {
    content: [{ raw: html`<div class="mt-0 -mt-0"></div>` }],
    theme: {
      margin: {
        0: '0',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .mt-0 {
        margin-top: 0;
      }
      .-mt-0 {
        margin-top: 0;
      }
    `)
  })
})

test('a color', () => {
  let config = {
    content: [{ raw: html`<div class="-bg-red"></div>` }],
    theme: {
      colors: {
        red: 'red',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css``)
  })
})

test('arbitrary values', () => {
  let config = {
    content: [{ raw: html`<div class="-mt-[10px]"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .-mt-\[10px\] {
        margin-top: -10px;
      }
    `)
  })
})

test('negating a negative scale value', () => {
  let config = {
    content: [{ raw: html`<div class="-mt-weird"></div>` }],
    theme: {
      margin: {
        weird: '-15px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .-mt-weird {
        margin-top: 15px;
      }
    `)
  })
})

test('negating a default value', () => {
  let config = {
    content: [{ raw: html`<div class="-mt"></div>` }],
    theme: {
      margin: {
        DEFAULT: '15px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .-mt {
        margin-top: -15px;
      }
    `)
  })
})

test('using a negative prefix with a negative default scale value', () => {
  let config = {
    content: [{ raw: html`<div class="mt -mt"></div>` }],
    theme: {
      margin: {
        DEFAULT: '8px',
        '-DEFAULT': '-4px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .mt {
        margin-top: 8px;
      }
      .-mt {
        margin-top: -4px;
      }
    `)
  })
})

test('negating a default value with a configured prefix', () => {
  let config = {
    prefix: 'tw-',
    content: [{ raw: html`<div class="tw--mt"></div>` }],
    theme: {
      margin: {
        DEFAULT: '15px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css`
      .tw--mt {
        margin-top: -15px;
      }
    `)
  })
})

test('arbitrary value keywords should be ignored', () => {
  let config = {
    content: [{ raw: html`<div class="-mt-[auto]"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchCss(css``)
  })
})
