import { run, html, css, defaults } from './util/run'
import { flagEnabled } from '../src/featureFlags'

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
      ${defaults({ defaultRingColor: 'rgba(var(--red), 0.5)' })}
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

it('falsy config values still work', () => {
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
        inset: 0;
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
      .shadow-one,
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
        lg: 'var(--a, 0 35px 60px -15px rgba(0, 0, 0)), 0 0 1px rgb(0, 0, 0)',
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
        --tw-shadow: var(--a, 0 35px 60px -15px #000), 0 0 1px #000;
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
      .bg-\[url\(\'\/images\/one-two-three\.png\'\)\,linear-gradient\(to_right\,_\#eeeeee\,_\#000000\)\] {
        background-image: url('/images/one-two-three.png'), linear-gradient(to right, #eee, #000);
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
      ${defaults({ defaultRingColor: '#3b82f680' })}
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
      ${defaults({ defaultRingColor: '#3b82f6bf' })}
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
      ${defaults({ defaultRingColor: '#ff7f7f80' })}
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
      ${defaults({ defaultRingColor: '#ff7f7f80' })}
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

test('A bare ring-opacity utility is supported when using respectDefaultRingColorOpacity', () => {
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

it('Ring color utilities are generated when using respectDefaultRingColorOpacity', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring ring-blue-500"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
      .ring-blue-500 {
        --tw-ring-opacity: 1;
        --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
      }
    `)
  })
})

test('should not crash when group names contain special characters', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [
      {
        raw: '<div class="group/${id}"><div class="group-hover/${id}:visible"></div></div>',
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    if (flagEnabled(config, 'oxideParser')) {
      expect(result.css).toMatchFormattedCss(css``)
    } else {
      expect(result.css).toMatchFormattedCss(css`
        .group\/\$\{id\}:hover .group-hover\/\$\{id\}\:visible {
          visibility: visible;
        }
      `)
    }
  })
})

it('should not crash when matching variants where utility classes are doubled up', () => {
  let config = {
    content: [
      {
        raw: '<div class="hover:foo"></div>',
      },
    ],
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .foo.foo {
        text-decoration-line: underline;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .hover\:foo:hover.hover\:foo:hover {
        text-decoration-line: underline;
      }
    `)
  })
})

test('detects quoted arbitrary values containing a slash', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="group-[[href^='/']]:hidden"></div>`,
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(
    flagEnabled(config, 'oxideParser')
      ? css`
          .group[href^='/'] .group-\[\[href\^\=\'\/\'\]\]\:hidden {
            display: none;
          }
        `
      : css`
          .hidden,
          .group[href^='/'] .group-\[\[href\^\=\'\/\'\]\]\:hidden {
            display: none;
          }
        `
  )
})

test('handled quoted arbitrary values containing escaped spaces', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="group-[[href^='_bar']]:hidden"></div>`,
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(
    flagEnabled(config, 'oxideParser')
      ? css`
          .group[href^=' bar'] .group-\[\[href\^\=\'_bar\'\]\]\:hidden {
            display: none;
          }
        `
      : css`
          .hidden,
          .group[href^=' bar'] .group-\[\[href\^\=\'_bar\'\]\]\:hidden {
            display: none;
          }
        `
  )
})
