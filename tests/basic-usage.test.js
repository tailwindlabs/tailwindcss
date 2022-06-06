import fs from 'fs'
import path from 'path'

import { html, run, css, defaults } from './util/run'

test('basic usage', () => {
  let config = {
    content: [path.resolve(__dirname, './basic-usage.test.html')],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    let expectedPath = path.resolve(__dirname, './basic-usage.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

test('all plugins are executed that match a candidate', () => {
  let config = {
    content: [{ raw: html`<div class="bg-green-light bg-green"></div>` }],
    theme: {
      colors: {
        green: {
          light: 'green',
        },
      },
    },
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;

    .bg-green {
      /* Empty on purpose */
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-green-light {
        --tw-bg-opacity: 1;
        background-color: rgb(0 128 0 / var(--tw-bg-opacity));
      }

      .bg-green {
        /* Empty on purpose */
      }
    `)
  })
})

test('per-plugin colors with the same key can differ when using a custom colors object', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="bg-theme text-theme">This should be green text on red background.</div>
        `,
      },
    ],
    theme: {
      // colors & theme MUST be plain objects
      // If they're functions here the test passes regardless
      colors: {
        theme: {
          bg: 'red',
          text: 'green',
        },
      },
      extend: {
        textColor: {
          theme: {
            DEFAULT: 'green',
          },
        },
        backgroundColor: {
          theme: {
            DEFAULT: 'red',
          },
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
      .bg-theme {
        --tw-bg-opacity: 1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
      }
      .text-theme {
        --tw-text-opacity: 1;
        color: rgb(0 128 0 / var(--tw-text-opacity));
      }
    `)
  })
})

test('default ring color can be a function', () => {
  function color(variable) {
    return function ({ opacityVariable, opacityValue }) {
      if (opacityValue !== undefined) {
        return `rgba(${variable}, ${opacityValue})`
      }
      if (opacityVariable !== undefined) {
        return `rgba(${variable}, var(${opacityVariable}, 1))`
      }
      return `rgb(${variable})`
    }
  }

  let config = {
    content: [
      {
        raw: html` <div class="ring"></div> `,
      },
    ],

    theme: {
      extend: {
        ringColor: {
          DEFAULT: color('var(--red)'),
        },
      },
    },
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      *,
      ::before,
      ::after,
      ::backdrop {
        --tw-border-spacing-x: 0;
        --tw-border-spacing-y: 0;
        --tw-translate-x: 0;
        --tw-translate-y: 0;
        --tw-rotate: 0;
        --tw-skew-x: 0;
        --tw-skew-y: 0;
        --tw-scale-x: 1;
        --tw-scale-y: 1;
        --tw-pan-x: ;
        --tw-pan-y: ;
        --tw-pinch-zoom: ;
        --tw-scroll-snap-strictness: proximity;
        --tw-ordinal: ;
        --tw-slashed-zero: ;
        --tw-numeric-figure: ;
        --tw-numeric-spacing: ;
        --tw-numeric-fraction: ;
        --tw-ring-inset: ;
        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-color: rgba(var(--red), 0.5);
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
        --tw-blur: ;
        --tw-brightness: ;
        --tw-contrast: ;
        --tw-grayscale: ;
        --tw-hue-rotate: ;
        --tw-invert: ;
        --tw-saturate: ;
        --tw-sepia: ;
        --tw-drop-shadow: ;
        --tw-backdrop-blur: ;
        --tw-backdrop-brightness: ;
        --tw-backdrop-contrast: ;
        --tw-backdrop-grayscale: ;
        --tw-backdrop-hue-rotate: ;
        --tw-backdrop-invert: ;
        --tw-backdrop-opacity: ;
        --tw-backdrop-saturate: ;
        --tw-backdrop-sepia: ;
      }

      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('fasly config values still work', () => {
  let config = {
    content: [{ raw: html`<div class="inset-0"></div>` }],
    theme: {
      inset: {
        0: 0,
      },
    },
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .inset-0 {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    `)
  })
})

it('shadows support values without a leading zero', () => {
  let config = {
    content: [{ raw: html`<div class="shadow-one shadow-two"></div>` }],
    theme: {
      boxShadow: {
        one: '0.5rem 0.5rem 0.5rem #0005',
        two: '.5rem .5rem .5rem #0005',
      },
    },
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .shadow-one {
        --tw-shadow: 0.5rem 0.5rem 0.5rem #0005;
        --tw-shadow-colored: 0.5rem 0.5rem 0.5rem var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      .shadow-two {
        --tw-shadow: 0.5rem 0.5rem 0.5rem #0005;
        --tw-shadow-colored: 0.5rem 0.5rem 0.5rem var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
    `)
  })
})

it('can scan extremely long classes without crashing', () => {
  let val = 'cols-' + '-a'.repeat(65536)
  let config = {
    content: [{ raw: html`<div class="${val}"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css``)
  })
})

it('does not produce duplicate output when seeing variants preceding a wildcard (*)', () => {
  let config = {
    content: [{ raw: html`underline focus:*` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    * {
      color: red;
    }

    .combined,
    * {
      text-align: center;
    }

    @layer base {
      * {
        color: blue;
      }

      .combined,
      * {
        color: red;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      * {
        color: blue;
      }

      .combined,
      * {
        color: red;
      }

      ${defaults}

      .underline {
        text-decoration-line: underline;
      }

      * {
        color: red;
      }

      .combined,
      * {
        text-align: center;
      }
    `)
  })
})

it('can parse box shadows with variables', () => {
  let config = {
    content: [{ raw: html`<div class="shadow-lg"></div>` }],
    theme: {
      boxShadow: {
        lg: 'var(-a, 0 35px 60px -15px rgba(0, 0, 0)), 0 0 1px rgb(0, 0, 0)',
      },
    },
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .shadow-lg {
        --tw-shadow: var(-a, 0 35px 60px -15px rgba(0, 0, 0)), 0 0 1px rgb(0, 0, 0);
        --tw-shadow-colored: 0 35px 60px -15px var(--tw-shadow-color),
          0 0 1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
    `)
  })
})

it('should generate styles using :not(.unknown-class) even if `.unknown-class` does not exist', () => {
  let config = {
    content: [{ raw: html`<div></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind components;

    @layer components {
      div:not(.unknown-class) {
        color: red;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      div:not(.unknown-class) {
        color: red;
      }
    `)
  })
})

it('supports multiple backgrounds as arbitrary values even if only some are quoted', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="bg-[url('/images/one-two-three.png'),linear-gradient(to_right,_#eeeeee,_#000000)]"
        ></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-\[url\(\'\/images\/one-two-three\.png\'\)\2c
        linear-gradient\(to_right\2c
        _\#eeeeee\2c
        _\#000000\)\] {
        background-image: url('/images/one-two-three.png'),
          linear-gradient(to right, #eeeeee, #000000);
      }
    `)
  })
})

it('The "default" ring opacity is used by the default ring color when not using respectDefaultRingColorOpacity (1)', () => {
  let config = {
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: 'rgb(59 130 246 / 0.5)' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('The "default" ring opacity is used by the default ring color when not using respectDefaultRingColorOpacity (2)', () => {
  let config = {
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringOpacity: {
        DEFAULT: 0.75,
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: 'rgb(59 130 246 / 0.75)' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('Customizing the default ring color uses the "default" opacity when not using respectDefaultRingColorOpacity (1)', () => {
  let config = {
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringColor: {
        DEFAULT: '#ff7f7f',
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: 'rgb(255 127 127 / 0.5)' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('Customizing the default ring color uses the "default" opacity when not using respectDefaultRingColorOpacity (2)', () => {
  let config = {
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringColor: {
        DEFAULT: '#ff7f7f00',
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: 'rgb(255 127 127 / 0.5)' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('The "default" ring color ignores the default opacity when using respectDefaultRingColorOpacity (1)', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#3b82f67f' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('The "default" ring color ignores the default opacity when using respectDefaultRingColorOpacity (2)', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringOpacity: {
        DEFAULT: 0.75,
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#3b82f67f' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('Customizing the default ring color preserves its opacity when using respectDefaultRingColorOpacity (1)', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringColor: {
        DEFAULT: '#ff7f7f',
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#ff7f7f' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('Customizing the default ring color preserves its opacity when using respectDefaultRingColorOpacity (2)', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringColor: {
        DEFAULT: '#ff7f7f00',
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#ff7f7f00' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('A bare ring-opacity utility is not supported when not using respectDefaultRingColorOpacity', () => {
  let config = {
    content: [{ raw: html`<div class="ring-opacity"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringOpacity: {
        DEFAULT: '0.33',
      },
    },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css``)
  })
})

it('A bare ring-opacity utility is supported when using respectDefaultRingColorOpacity', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring-opacity"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringOpacity: {
        DEFAULT: '0.33',
      },
    },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .ring-opacity {
        --tw-ring-opacity: 0.33;
      }
    `)
  })
})
