import { run, html, css } from './util/run'
import { env } from '../src/lib/sharedState'

let group = env.OXIDE ? describe : describe.skip

group('@apply', () => {
  it('should apply simple utilities', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-2 bg-white rounded-md;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
          border-radius: 0.375rem;
          padding: 0.5rem;
        }
      `)
    })
  })

  it('should apply arbitrary properties', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply [color:red] [display:none];
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          color: red;
          display: none;
        }
      `)
    })
  })

  it('should apply arbitrary values', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-[12px] m-[4px];
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          margin: 4px;
          padding: 12px;
        }
      `)
    })
  })

  it('should apply user css that also exists as a utility', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      @layer utilities {
        .p-2 {
          color: red;
        }
      }

      .btn {
        @apply p-2;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          color: red;
          padding: 0.5rem;
        }
      `)
    })
  })

  it('should apply utilities with simple variants', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-2 bg-white rounded-full hover:rounded-md;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
          border-radius: 9999px;
          padding: 0.5rem;
        }

        .btn:hover {
          border-radius: 0.375rem;
        }
      `)
    })
  })

  it('should apply utilities with arbitrary variants', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-2 bg-white rounded-full [&_.foo]:rounded-md;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
          border-radius: 9999px;
          padding: 0.5rem;
        }

        .btn .foo {
          border-radius: 0.375rem;
        }
      `)
    })
  })

  it('should apply utilities with stacked arbitrary variants', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-2 bg-white rounded-full [.foo_&]:[&_.bar]:rounded-md;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
          border-radius: 9999px;
          padding: 0.5rem;
        }

        .foo :is(.btn .bar) {
          border-radius: 0.375rem;
        }
      `)
    })
  })

  it('should apply atrule variants', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-2 md:p-4;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          padding: 0.5rem;
        }

        @media (min-width: 768px) {
          .btn {
            padding: 1rem;
          }
        }
      `)
    })
  })

  it('should apply variants from external plugins with internal variants', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
      plugins: [
        function ({ addVariant }) {
          addVariant('my-variant', '@supports (display: grid) { @media print { &::orange }}')
        },
      ],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply italic md:my-variant:hover:underline;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          font-style: italic;
        }

        @supports (display: grid) {
          @media print {
            @media (min-width: 768px) {
              .btn:hover::orange {
                text-decoration-line: underline;
              }
            }
          }
        }
      `)
    })
  })

  it('should apply utilities with multiple variants', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-2 bg-white rounded-full focus:hover:rounded-md;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
          border-radius: 9999px;
          padding: 0.5rem;
        }

        .btn:hover:focus {
          border-radius: 0.375rem;
        }
      `)
    })
  })

  it('should apply utilities with parallel variants', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-2 bg-white rounded-full marker:rounded-md;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
          border-radius: 9999px;
          padding: 0.5rem;
        }

        .btn ::marker,
        .btn::marker {
          border-radius: 0.375rem;
        }
      `)
    })
  })

  it('should apply utilities with stacked and parallel variants', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
      plugins: [
        function ({ addVariant }) {
          addVariant('foo', ['.foo_1 &', '.foo_2 &'])
          addVariant('bar', ['.bar_1 &', '.bar_2 &'])
        },
      ],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply p-2 bg-white rounded-full focus:foo:hover:bar:rounded-md;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          --tw-bg-opacity: 1;
          background-color: rgb(255 255 255 / var(--tw-bg-opacity));
          border-radius: 9999px;
          padding: 0.5rem;
        }

        .foo_1 .bar_1 .btn:hover:focus,
        .foo_2 .bar_1 .btn:hover:focus,
        .foo_1 .bar_2 .btn:hover:focus,
        .foo_2 .bar_2 .btn:hover:focus {
          border-radius: 0.375rem;
        }
      `)
    })
  })

  it('should apply user css', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      @layer utilities {
        .custom-util {
          color: red;

          &:hover {
            color: blue;
          }
        }
      }

      .btn {
        @apply custom-util;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          color: red;
        }

        .btn:hover {
          color: #00f;
        }
      `)
    })
  })

  it('should apply user css that itself contains @apply rules', async () => {
    let config = {
      content: [{ raw: html`<button class="btn">My Button</button>` }],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      @layer utilities {
        .custom-util {
          @apply p-2 underline;

          &:hover {
            @apply md:font-bold;
          }
        }
      }

      .btn {
        @apply custom-util;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(
        css`
          .btn {
            padding: 0.5rem;
            text-decoration-line: underline;
          }

          @media (min-width: 768px) {
            .btn:hover {
              font-weight: 700;
            }
          }
        `
      )
    })
  })

  it('should mark utils as important when using !important', async () => {
    let config = {
      content: [{ raw: html`<button class="btn btn-2">My Button</button>` }],
    }

    let input = css`
      @tailwind components;
      @tailwind utilities;

      .btn {
        @apply font-bold underline !important;
      }

      /* Mutability check: Ensuring this is generated _without_ the !important */
      .btn-2 {
        @apply underline;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .btn {
          font-weight: 700 !important;
          text-decoration-line: underline !important;
        }

        .btn-2 {
          text-decoration-line: underline;
        }
      `)
    })
  })
})
