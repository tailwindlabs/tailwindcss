import fs from 'fs'
import path from 'path'

import { run, css, html } from './util/run'

test('responsive and variants atrules', () => {
  let config = {
    content: [path.resolve(__dirname, './responsive-and-variants-atrules.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind components;
    @tailwind utilities;

    @layer utilities {
      @responsive {
        .responsive-in-utilities {
          color: blue;
        }
      }
      @variants {
        .variants-in-utilities {
          color: red;
        }
      }
      @responsive {
        @variants {
          .both-in-utilities {
            color: green;
          }
        }
      }
    }

    @responsive {
      .responsive-at-root {
        color: white;
      }
    }
    @variants {
      .variants-at-root {
        color: orange;
      }
    }
    @responsive {
      @variants {
        .both-at-root {
          color: pink;
        }
      }
    }

    @layer components {
      @responsive {
        .responsive-in-components {
          color: blue;
        }
      }
      @variants {
        .variants-in-components {
          color: red;
        }
      }
      @responsive {
        @variants {
          .both-in-components {
            color: green;
          }
        }
      }
    }
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './responsive-and-variants-atrules.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

it('should sort breakpoints intelligentally', () => {
  let config = {
    content: [{ raw: html`<div class="xs:italic md:underline"></div>` }],
    theme: {
      extend: {
        screens: {
          xs: '123px',
        },
      },
    },
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 123px) {
        .xs\:italic {
          font-style: italic;
        }
      }

      @media (min-width: 768px) {
        .md\:underline {
          text-decoration-line: underline;
        }
      }
    `)
  })
})
