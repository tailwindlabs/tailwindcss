import { run, html, css } from './util/run'

it('should generate the partial selector, if only a partial is used (base layer)', () => {
  let config = {
    content: [{ raw: html`<div></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;

    @layer base {
      :root {
        font-weight: bold;
      }

      /* --- */

      :root,
      .a {
        color: black;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      :root {
        font-weight: bold;
      }

      /* --- */

      :root,
      .a {
        color: black;
      }

      *,
      ::before,
      ::after {
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
        border-color: #e5e7eb;
        --tw-ordinal: ;
        --tw-slashed-zero: ;
        --tw-numeric-figure: ;
        --tw-numeric-spacing: ;
        --tw-numeric-fraction: ;
        --tw-ring-inset: ;
        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-color: rgb(59 130 246 / 0.5);
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
    `)
  })
})

it('should generate the partial selector, if only a partial is used (utilities layer)', () => {
  let config = {
    content: [{ raw: html`<div class="a"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      :root {
        font-weight: bold;
      }

      /* --- */

      :root,
      .a {
        color: black;
      }
    }
  `

  return run(input, config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      :root {
        font-weight: bold;
      }

      /* --- */

      :root,
      .a {
        color: black;
      }
    `)
  })
})
