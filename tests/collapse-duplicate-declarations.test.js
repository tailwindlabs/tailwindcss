import { run, html, css } from './util/run'

it('should collapse duplicate declarations with the same units (px)', () => {
  let config = {
    content: [{ raw: html`<div class="example"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      .example {
        height: 100px;
        height: 200px;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .example {
        height: 200px;
      }
    `)
  })
})

it('should collapse duplicate declarations with the same units (no unit)', () => {
  let config = {
    content: [{ raw: html`<div class="example"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      .example {
        line-height: 3;
        line-height: 2;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .example {
        line-height: 2;
      }
    `)
  })
})

it('should not collapse duplicate declarations with the different units', () => {
  let config = {
    content: [{ raw: html`<div class="example"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      .example {
        height: 100px;
        height: 50%;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .example {
        height: 100px;
        height: 50%;
      }
    `)
  })
})

it('should collapse the duplicate declarations with the same unit, but leave the ones with different units', () => {
  let config = {
    content: [{ raw: html`<div class="example"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      .example {
        height: 100px;
        height: 50%;
        height: 20vh;
        height: 200px;
        height: 100%;
        height: 30vh;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .example {
        height: 200px;
        height: 100%;
        height: 30vh;
      }
    `)
  })
})

it('should collapse the duplicate declarations with the exact same value', () => {
  let config = {
    content: [{ raw: html`<div class="example"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      .example {
        height: var(--value);
        color: blue;
        height: var(--value);
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .example {
        color: #00f;
        height: var(--value);
      }
    `)
  })
})

it('should work on a real world example', () => {
  let config = {
    content: [{ raw: html`<div class="h-available"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      .h-available {
        height: 100%;
        height: 100vh;
        height: -webkit-fill-available;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .h-available {
        height: 100%;
        height: 100vh;
        height: -webkit-fill-available;
      }
    `)
  })
})
