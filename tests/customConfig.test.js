import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import tailwind from '../src/index'
import { cjsConfigFile, defaultConfigFile } from '../src/constants'
import inTempDirectory from '../jest/runInTempDirectory'

// NOTE: If we ever want to abstract this logic, then we have to watch out
// because in most tests we default to an empty object here. However, in this
// tests we do want to check the difference between no config (undefined) and a
// config (empty object or full object).
function run(input, config /* Undefined is important in this case */) {
  return postcss(tailwind(config)).process(input, {
    from: path.resolve(__filename),
  })
}

function css(templates) {
  return templates.join('')
}

function html(templates) {
  return templates.join('')
}

function javascript(templates) {
  return templates.join('')
}

test('it uses the values from the custom config file', () => {
  let config = require(path.resolve(`${__dirname}/fixtures/custom-config.js`))

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 400px) {
        .mobile\\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})

test('custom config can be passed as an object', () => {
  let config = {
    purge: [{ raw: html`<div class="mobile:font-bold"></div>` }],
    theme: {
      screens: {
        mobile: '400px',
      },
    },
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 400px) {
        .mobile\\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})

test('custom config path can be passed using `config` property in an object', () => {
  let config = {
    config: path.resolve(`${__dirname}/fixtures/custom-config.js`),
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 400px) {
        .mobile\\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})

test('custom config can be passed under the `config` property', () => {
  let config = {
    config: {
      purge: [{ raw: html`<div class="mobile:font-bold"></div>` }],
      theme: {
        screens: {
          mobile: '400px',
        },
      },
    },
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 400px) {
        .mobile\\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})

test('tailwind.config.cjs is picked up by default', () => {
  return inTempDirectory(() => {
    fs.writeFileSync(
      path.resolve(cjsConfigFile),
      javascript`module.exports = {
        purge: [{ raw: '<div class="mobile:font-bold"></div>' }],
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    let content = css`
      @tailwind utilities;
    `

    return run(content).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 400px) {
          .mobile\\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })
})

test('tailwind.config.js is picked up by default', () => {
  return inTempDirectory(() => {
    fs.writeFileSync(
      path.resolve(defaultConfigFile),
      javascript`module.exports = {
        purge: [{ raw: '<div class="mobile:font-bold"></div>' }],
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    let content = css`
      @tailwind utilities;
    `

    return run(content).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 400px) {
          .mobile\\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })
})

test('tailwind.config.cjs is picked up by default when passing an empty object', () => {
  return inTempDirectory(() => {
    fs.writeFileSync(
      path.resolve(cjsConfigFile),
      javascript`module.exports = {
        purge: [{ raw: '<div class="mobile:font-bold"></div>' }],
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    let content = css`
      @tailwind utilities;
    `

    return run(content, {}).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 400px) {
          .mobile\\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })
})

test('tailwind.config.js is picked up by default when passing an empty object', () => {
  return inTempDirectory(() => {
    fs.writeFileSync(
      path.resolve(defaultConfigFile),
      javascript`module.exports = {
        purge: [{ raw: '<div class="mobile:font-bold"></div>' }],
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    let content = css`
      @tailwind utilities;
    `

    return run(content, {}).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 400px) {
          .mobile\\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })
})

test('the default config can be overridden using the presets key', () => {
  let config = {
    purge: [{ raw: html`<div class="min-h-0 min-h-primary min-h-secondary"></div>` }],
    presets: [
      {
        theme: {
          extend: { minHeight: { secondary: '24px' } },
        },
      },
    ],
    theme: {
      extend: { minHeight: { primary: '48px' } },
    },
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .min-h-0 {
        min-height: 0px;
      }
      .min-h-primary {
        min-height: 48px;
      }
      .min-h-secondary {
        min-height: 24px;
      }
    `)
  })
})

test('presets can be functions', () => {
  let config = {
    purge: [{ raw: html`<div class="min-h-0 min-h-primary min-h-secondary"></div>` }],
    presets: [
      () => ({
        theme: {
          extend: { minHeight: { secondary: '24px' } },
        },
      }),
    ],
    theme: {
      extend: { minHeight: { primary: '48px' } },
    },
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .min-h-0 {
        min-height: 0px;
      }
      .min-h-primary {
        min-height: 48px;
      }
      .min-h-secondary {
        min-height: 24px;
      }
    `)
  })
})

test('the default config can be removed by using an empty presets key in a preset', () => {
  let config = {
    purge: [{ raw: html`<div class="min-h-0 min-h-primary min-h-secondary"></div>` }],
    presets: [
      {
        presets: [],
        theme: {
          extend: { minHeight: { secondary: '24px' } },
        },
      },
    ],
    theme: {
      extend: { minHeight: { primary: '48px' } },
    },
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .min-h-primary {
        min-height: 48px;
      }
      .min-h-secondary {
        min-height: 24px;
      }
    `)
  })
})

test('presets can have their own presets', () => {
  let config = {
    purge: [{ raw: html`<div class="bg-transparent bg-black bg-white bg-red"></div>` }],
    presets: [
      {
        presets: [],
        theme: {
          colors: { red: '#dd0000' },
        },
      },
      {
        presets: [
          {
            presets: [],
            theme: {
              colors: {
                transparent: 'transparent',
                red: '#ff0000',
              },
            },
          },
        ],
        theme: {
          extend: {
            colors: {
              black: 'black',
              red: '#ee0000',
            },
            backgroundColor: (theme) => theme('colors'),
          },
        },
        corePlugins: ['backgroundColor'],
      },
    ],
    theme: {
      extend: { colors: { white: 'white' } },
    },
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-transparent {
        background-color: transparent;
      }
      .bg-black {
        background-color: black;
      }
      .bg-white {
        background-color: white;
      }
      .bg-red {
        background-color: #ee0000;
      }
    `)
  })
})

test('function presets can be mixed with object presets', () => {
  let config = {
    purge: [{ raw: html`<div class="bg-transparent bg-black bg-white bg-red"></div>` }],
    presets: [
      () => ({
        presets: [],
        theme: {
          colors: { red: '#dd0000' },
        },
      }),
      {
        presets: [
          () => ({
            presets: [],
            theme: {
              colors: {
                transparent: 'transparent',
                red: '#ff0000',
              },
            },
          }),
        ],
        theme: {
          extend: {
            colors: {
              black: 'black',
              red: '#ee0000',
            },
            backgroundColor: (theme) => theme('colors'),
          },
        },
        corePlugins: ['backgroundColor'],
      },
    ],
    theme: {
      extend: { colors: { white: 'white' } },
    },
  }

  let content = css`
    @tailwind utilities;
  `

  return run(content, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-transparent {
        background-color: transparent;
      }
      .bg-black {
        background-color: black;
      }
      .bg-white {
        background-color: white;
      }
      .bg-red {
        background-color: #ee0000;
      }
    `)
  })
})
