import { crosscheck, run, html, css } from '../util/run'

crosscheck(() => {
  test('disabling `listStyleType` disables `listStyle` plugin', () => {
    let config = {
      content: [{ raw: html`<div class="list-disc"></div>` }],
      corePlugins: { preflight: false, listStyleType: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css``)
    })
  })

  test('custom listStyleType values work with listStyle by default', () => {
    let config = {
      content: [{ raw: html`<div class="list-disc"></div>` }],
      corePlugins: { preflight: false },
      theme: {
        extend: {
          listStyleType: {
            disc: 'potato',
          },
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-disc {
          list-style: potato;
        }
      `)
    })
  })

  it('overriding listStyleType overrides listStyle in practice too', () => {
    let config = {
      content: [{ raw: html`<div class="list-disc list-square"></div>` }],
      corePlugins: { preflight: false },
      theme: {
        listStyleType: {
          square: 'square',
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-square {
          list-style: square;
        }
      `)
    })
  })

  it('should generate list style utilities from new listStyleType values', () => {
    let config = {
      content: [{ raw: html`<div class="list-square"></div>` }],
      corePlugins: { preflight: false },
      theme: {
        extend: {
          listStyleType: {
            square: 'square',
          },
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-square {
          list-style: square;
        }
      `)
    })
  })

  it('using theme to look up listStyleType values still works', () => {
    let config = {
      content: [{ raw: html`<div class="list-[theme(listStyleType.disc)]"></div>` }],
      corePlugins: { preflight: false },
      theme: {},
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-\[theme\(listStyleType\.disc\)\] {
          list-style: disc;
        }
      `)
    })
  })

  it('should generate list style utilities from overriden listStyleType values', () => {
    let config = {
      content: [{ raw: html`<div class="list-[theme(listStyleType.disc)]"></div>` }],
      corePlugins: { preflight: false },
      theme: {
        extend: {
          listStyleType: {
            disc: 'potato',
          },
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-\[theme\(listStyleType\.disc\)\] {
          list-style: potato;
        }
      `)
    })
  })

  it('arbitrary values are generated using list-style', () => {
    let config = {
      content: [{ raw: html`<div class="list-[square]"></div>` }],
      corePlugins: { preflight: false },
      theme: {},
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-\[square\] {
          list-style: square;
        }
      `)
    })
  })

  it('customized listStyle defaults are used instead of listStyleType defaults', () => {
    let config = {
      content: [{ raw: html`<div class="list-disc"></div>` }],
      corePlugins: { preflight: false },
      theme: { extend: { listStyle: { disc: 'potato' } } },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-disc {
          list-style: potato;
        }
      `)
    })
  })

  it('overriding listStyle completely prevents listStyleType defaults from being generated', () => {
    let config = {
      content: [{ raw: html`<div class="list-decimal list-disc"></div>` }],
      corePlugins: { preflight: false },
      theme: { listStyle: { disc: 'potato' } },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-disc {
          list-style: potato;
        }
      `)
    })
  })

  it('should apply list style utilities using arbitrary values', () => {
    let config = {
      content: [{ raw: html`<div class="foo"></div>` }],
      corePlugins: { preflight: false },
      theme: {},
    }

    let input = css`
      @tailwind utilities;

      .foo {
        @apply list-[square];
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .foo {
          list-style: square;
        }
      `)
    })
  })

  it('should be possible to apply list style values using list style type values using theme function', () => {
    let config = {
      content: [{ raw: html`<div class="foo"></div>` }],
      corePlugins: { preflight: false },
      theme: {
        extend: {
          listStyleType: {
            disc: 'potato',
          },
        },
      },
    }

    let input = css`
      @tailwind utilities;

      .foo {
        list-style: theme(listStyleType.disc);
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .foo {
          list-style: potato;
        }
      `)
    })
  })

  it('should be possible to apply list style utilities with arbitrary values using the theme function reading from listStyleType', () => {
    let config = {
      content: [{ raw: html`<div class="foo"></div>` }],
      corePlugins: { preflight: false },
      theme: {
        extend: {
          listStyleType: {
            disc: 'potato',
          },
        },
      },
    }

    let input = css`
      @tailwind utilities;

      .foo {
        @apply list-[theme(listStyleType.disc)];
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .foo {
          list-style: potato;
        }
      `)
    })
  })

})
