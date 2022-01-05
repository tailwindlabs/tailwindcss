import { run, html, css } from './util/run'

it('should be possible to matchComponents', () => {
  let config = {
    content: [
      {
        raw: html`<div class="card-[#0088cc] hover:card-[#f0f]">
          <div class="card-header font-bold"></div>
          <div class="shadow"></div>
          <div class="card-footer text-center"></div>
        </div>`,
      },
    ],
    corePlugins: {
      preflight: false,
    },
    plugins: [
      function ({ matchComponents }) {
        matchComponents({
          card: (value) => {
            return [
              { color: value },
              {
                '.card-header': {
                  borderTopWidth: 3,
                  borderTopColor: value,
                },
              },
              {
                '.card-footer': {
                  borderBottomWidth: 3,
                  borderBottomColor: value,
                },
              },
            ]
          },
        })
      },
    ],
  }

  return run('@tailwind base; @tailwind components; @tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
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

      .shadow {
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
        --tw-shadow-colored: 0 0 #0000;
      }

      .card-\[\#0088cc\] {
        color: #0088cc;
      }

      .card-\[\#0088cc\] .card-header {
        border-top-width: 3px;
        border-top-color: #0088cc;
      }

      .card-\[\#0088cc\] .card-footer {
        border-bottom-width: 3px;
        border-bottom-color: #0088cc;
      }

      .text-center {
        text-align: center;
      }

      .font-bold {
        font-weight: 700;
      }

      .shadow {
        --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
          0 1px 2px -1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }

      .hover\:card-\[\#f0f\]:hover {
        color: #f0f;
      }

      .hover\:card-\[\#f0f\]:hover .card-header {
        border-top-width: 3px;
        border-top-color: #f0f;
      }

      .hover\:card-\[\#f0f\]:hover .card-footer {
        border-bottom-width: 3px;
        border-bottom-color: #f0f;
      }
    `)
  })
})
