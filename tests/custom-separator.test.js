import { run, html, css } from './util/run'

test('custom separator', () => {
  let config = {
    darkMode: 'selector',
    content: [
      {
        raw: html`
          <div class="md_hover_text-right"></div>
          <div class="motion-safe_hover_text-center"></div>
          <div class="dark_focus_text-left"></div>
          <div class="group-hover_focus-within_text-left"></div>
          <div class="rtl_active_text-center"></div>
        `,
      },
    ],
    separator: '_',
  }

  return run('@tailwind utilities', config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .group:hover .group-hover_focus-within_text-left:focus-within {
        text-align: left;
      }
      @media (prefers-reduced-motion: no-preference) {
        .motion-safe_hover_text-center:hover {
          text-align: center;
        }
      }
      @media (min-width: 768px) {
        .md_hover_text-right:hover {
          text-align: right;
        }
      }
      .rtl_active_text-center:active:where([dir='rtl'], [dir='rtl'] *) {
        text-align: center;
      }
      .dark_focus_text-left:focus:where(.dark, .dark *) {
        text-align: left;
      }
    `)
  })
})

test('dash is not supported', () => {
  let config = {
    darkMode: 'selector',
    content: [{ raw: 'lg-hover-font-bold' }],
    separator: '-',
  }

  return expect(run('@tailwind utilities', config)).rejects.toThrowError(
    "The '-' character cannot be used as a custom separator in JIT mode due to parsing ambiguity. Please use another character like '_' instead."
  )
})
