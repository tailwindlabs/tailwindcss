import fs from 'fs'
import path from 'path'
import inTempDirectory from '../jest/runInTempDirectory'

import { run, html, css, javascript } from './util/run'

const defaultConfigFile = 'tailwind.config.js'
const cjsConfigFile = 'tailwind.config.cjs'

test('it uses the values from the custom config file', () => {
  let config = require(path.resolve(`${__dirname}/fixtures/custom-config.js`))

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 400px) {
        .mobile\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})

test('custom config can be passed as an object', () => {
  let config = {
    content: [{ raw: html`<div class="mobile:font-bold"></div>` }],
    theme: {
      screens: {
        mobile: '400px',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 400px) {
        .mobile\:font-bold {
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

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 400px) {
        .mobile\:font-bold {
          font-weight: 700;
        }
      }
    `)
  })
})

test('custom config can be passed under the `config` property', () => {
  let config = {
    config: {
      content: [{ raw: html`<div class="mobile:font-bold"></div>` }],
      theme: {
        screens: {
          mobile: '400px',
        },
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @media (min-width: 400px) {
        .mobile\:font-bold {
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
        content: [{ raw: '<div class="mobile:font-bold"></div>' }],
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    return run('@tailwind utilities').then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 400px) {
          .mobile\:font-bold {
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
        content: [{ raw: '<div class="mobile:font-bold"></div>' }],
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    return run('@tailwind utilities').then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 400px) {
          .mobile\:font-bold {
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
        content: [{ raw: '<div class="mobile:font-bold"></div>' }],
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    return run('@tailwind utilities', {}).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 400px) {
          .mobile\:font-bold {
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
        content: [{ raw: '<div class="mobile:font-bold"></div>' }],
        theme: {
          screens: {
            mobile: '400px',
          },
        },
      }`
    )

    return run('@tailwind utilities', {}).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 400px) {
          .mobile\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })
})

test('the default config can be overridden using the presets key', () => {
  let config = {
    content: [{ raw: html`<div class="min-h-primary min-h-secondary min-h-0"></div>` }],
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

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .min-h-0 {
        min-height: 0;
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
    content: [{ raw: html`<div class="min-h-primary min-h-secondary min-h-0"></div>` }],
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

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .min-h-0 {
        min-height: 0;
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
    content: [{ raw: html`<div class="min-h-primary min-h-secondary min-h-0"></div>` }],
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

  return run('@tailwind utilities', config).then((result) => {
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
    content: [{ raw: html`<div class="bg-red bg-transparent bg-black bg-white"></div>` }],
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

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-black {
        background-color: #000;
      }
      .bg-red {
        background-color: #e00;
      }
      .bg-transparent {
        background-color: #0000;
      }
      .bg-white {
        background-color: #fff;
      }
    `)
  })
})

test('function presets can be mixed with object presets', () => {
  let config = {
    content: [{ raw: html`<div class="bg-red bg-transparent bg-black bg-white"></div>` }],
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

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-black {
        background-color: #000;
      }
      .bg-red {
        background-color: #e00;
      }
      .bg-transparent {
        background-color: #0000;
      }
      .bg-white {
        background-color: #fff;
      }
    `)
  })
})
