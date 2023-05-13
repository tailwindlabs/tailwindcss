import { crosscheck, run, html, css } from './util/run'

crosscheck(() => {
  let defaultScreens = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }

  it('sorts min and max correctly relative to screens and each other', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="font-bold max-[800px]:font-bold max-[700px]:font-bold sm:font-bold min-[700px]:font-bold md:font-bold min-[800px]:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: defaultScreens,
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .font-bold {
          font-weight: 700;
        }
        @media (max-width: 800px) {
          .max-\[800px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-width: 700px) {
          .max-\[700px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 640px) {
          .sm\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 700px) {
          .min-\[700px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 768px) {
          .md\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 800px) {
          .min-\[800px\]\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('works when using min variants screens config is empty and variants all use the same unit', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="font-bold sm:font-bold min-[700px]:font-bold md:font-bold min-[800px]:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {},
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (min-width: 700px) {
        .min-\[700px\]\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 800px) {
        .min-\[800px\]\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().not.toHaveBeenWarned()
  })

  it('works when using max variants screens config is empty and variants all use the same unit', () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="font-bold max-[800px]:font-bold max-[700px]:font-bold sm:font-bold md:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {},
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .font-bold {
          font-weight: 700;
        }
        @media (max-width: 800px) {
          .max-\[800px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-width: 700px) {
          .max-\[700px\]\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('converts simple min-width screens for max variant', () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="font-bold max-lg:font-bold max-[700px]:font-bold max-sm:font-bold max-[300px]:font-bold sm:font-bold md:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: defaultScreens,
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .font-bold {
          font-weight: 700;
        }
        @media not all and (min-width: 1024px) {
          .max-lg\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-width: 700px) {
          .max-\[700px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media not all and (min-width: 640px) {
          .max-sm\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-width: 300px) {
          .max-\[300px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 640px) {
          .sm\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 768px) {
          .md\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('does not have keyed screens for min variant', () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="min-sm:font-bold min-lg:font-bold font-bold min-[300px]:font-bold sm:font-bold min-[700px]:font-bold md:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: defaultScreens,
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .font-bold {
          font-weight: 700;
        }
        @media (min-width: 300px) {
          .min-\[300px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 640px) {
          .sm\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 700px) {
          .min-\[700px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 768px) {
          .md\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('supports min-* and max-* variants with or without arbitrary dimension prefixes', () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="font-bold min-[100px]:font-bold max-[100px]:font-bold min-[w:100px]:font-bold max-[w:100px]:font-bold min-[h:100px]:font-bold max-[h:100px]:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: defaultScreens,
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .font-bold {
          font-weight: 700;
        }
        @media (max-height: 100px) {
          .max-\[h\:100px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-width: 100px) {
          .max-\[100px\]\:font-bold,
          .max-\[w\:100px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-height: 100px) {
          .min-\[h\:100px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 100px) {
          .min-\[100px\]\:font-bold,
          .min-\[w\:100px\]\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('supports min-* and max-* variants being chained together with or without arbitrary dimension prefixes', () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="min-[100px]:min-[w:100px]:min-[h:100px]:max-[100px]:max-[w:100px]:max-[h:100px]:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: defaultScreens,
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (min-width: 100px) {
          @media (min-width: 100px) {
            @media (min-height: 100px) {
              @media (max-width: 100px) {
                @media (max-width: 100px) {
                  @media (max-height: 100px) {
                    .min-\[100px\]\:min-\[w\:100px\]\:min-\[h\:100px\]\:max-\[100px\]\:max-\[w\:100px\]\:max-\[h\:100px\]\:font-bold {
                      font-weight: 700;
                    }
                  }
                }
              }
            }
          }
        }
      `)
    })
  })

  it('supports proper sorting of min-* and max-* variants with arbitrary dimension prefixes', () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="
                max-[3px]:font-bold max-[1px]:font-bold max-[2px]:font-bold
                max-[w:3px]:font-bold max-[w:1px]:font-bold max-[w:2px]:font-bold
                max-[h:3px]:font-bold max-[h:1px]:font-bold max-[h:2px]:font-bold
                min-[3px]:font-bold min-[1px]:font-bold min-[2px]:font-bold
                min-[w:3px]:font-bold min-[w:1px]:font-bold min-[w:2px]:font-bold
                min-[h:3px]:font-bold min-[h:1px]:font-bold min-[h:2px]:font-bold
              "
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: defaultScreens,
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        @media (max-height: 3px) {
          .max-\[h\:3px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-height: 2px) {
          .max-\[h\:2px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-height: 1px) {
          .max-\[h\:1px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-width: 3px) {
          .max-\[3px\]\:font-bold,
          .max-\[w\:3px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-width: 2px) {
          .max-\[2px\]\:font-bold,
          .max-\[w\:2px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (max-width: 1px) {
          .max-\[1px\]\:font-bold,
          .max-\[w\:1px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-height: 1px) {
          .min-\[h\:1px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-height: 2px) {
          .min-\[h\:2px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-height: 3px) {
          .min-\[h\:3px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 1px) {
          .min-\[1px\]\:font-bold,
          .min-\[w\:1px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 2px) {
          .min-\[2px\]\:font-bold,
          .min-\[w\:2px\]\:font-bold {
            font-weight: 700;
          }
        }
        @media (min-width: 3px) {
          .min-\[3px\]\:font-bold,
          .min-\[w\:3px\]\:font-bold {
            font-weight: 700;
          }
        }
      `)
    })
  })

  it('warns when using min variants with complex screen configs', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div class="font-bold sm:font-bold min-[700px]:font-bold md:font-bold"></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',

          // Any presence of an object makes it complex
          yodawg: { min: '700px' },
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (min-width: 640px) {
        .sm\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 768px) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['complex-screen-config'])
  })

  it('warns when using min variants with simple configs containing mixed units', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div class="font-bold sm:font-bold min-[700px]:font-bold md:font-bold"></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {
          sm: '640px',
          md: '48rem',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (min-width: 640px) {
        .sm\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 48rem) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['mixed-screen-units'])
  })

  it('warns when using min variants with mixed units (with screens config)', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div class="min-[700rem]:font-bold font-bold sm:font-bold md:font-bold"></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (min-width: 640px) {
        .sm\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 768px) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['minmax-have-mixed-units'])
  })

  it('warns when using min variants with mixed units (with no screens config)', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="min-[700rem]:font-bold font-bold sm:font-bold min-[700px]:font-bold md:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {},
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (min-width: 700px) {
        .min-\[700px\]\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['minmax-have-mixed-units'])
  })

  it('warns when using max variants with complex screen configs', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div class="font-bold max-[700px]:font-bold sm:font-bold md:font-bold"></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',

          // Any presence of an object makes it complex
          yodawg: { min: '700px' },
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (min-width: 640px) {
        .sm\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 768px) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['complex-screen-config'])
  })

  it('warns when using max variants with simple configs containing mixed units', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div class="font-bold max-[700px]:font-bold sm:font-bold md:font-bold"></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {
          sm: '640px',
          md: '48rem',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (min-width: 640px) {
        .sm\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 48rem) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['mixed-screen-units'])
  })

  it('warns when using max variants with mixed units (with screens config)', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div class="max-[700rem]:font-bold font-bold sm:font-bold md:font-bold"></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (min-width: 640px) {
        .sm\:font-bold {
          font-weight: 700;
        }
      }
      @media (min-width: 768px) {
        .md\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['minmax-have-mixed-units'])
  })

  it('warns when using max variants with mixed units (with no screens config)', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="max-[700rem]:font-bold font-bold max-[700px]:font-bold sm:font-bold md:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {},
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (max-width: 700px) {
        .max-\[700px\]\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['minmax-have-mixed-units'])
  })

  it('warns when using min and max variants with mixed units (with no screens config)', async () => {
    let config = {
      content: [
        {
          raw: html`
            <div
              class="max-[700rem]:font-bold font-bold sm:font-bold min-[700px]:font-bold md:font-bold"
            ></div>
          `,
        },
      ],
      corePlugins: { preflight: false },
      theme: {
        screens: {},
      },
    }

    let input = css`
      @tailwind utilities;
    `

    let result = await run(input, config)

    expect(result.css).toMatchFormattedCss(css`
      .font-bold {
        font-weight: 700;
      }
      @media (max-width: 700rem) {
        .max-\[700rem\]\:font-bold {
          font-weight: 700;
        }
      }
    `)

    expect().toHaveBeenWarnedWith(['minmax-have-mixed-units'])
  })
})
