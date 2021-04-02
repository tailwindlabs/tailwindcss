const postcss = require('postcss')
const tailwind = require('../index.js')
const fs = require('fs')
const path = require('path')

function run(input, config = {}) {
  return postcss(tailwind(config)).process(input, { from: path.resolve(__filename) })
}

test('responsive and variants atrules', () => {
  let config = {
    purge: [path.resolve(__dirname, './responsive-and-variants-atrules.test.html')],
    corePlugins: { preflight: false },
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
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

  return run(css, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './responsive-and-variants-atrules.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})
