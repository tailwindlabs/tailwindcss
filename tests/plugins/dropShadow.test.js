import { crosscheck, run, html, css } from '../util/run'

crosscheck(() => {
  it('should be possible to define dropShadow as a string', () => {
    let config = {
      content: [{ raw: html`<div class="drop-shadow-foo"></div>` }],
      theme: {
        dropShadow: {
          foo: '10px 10px 10px #000',
        },
      },
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities;', config).then((result) => {
      expect(result.css).toMatchCss(css`
        .drop-shadow-foo {
          --tw-drop-shadow: drop-shadow(10px 10px 10px #000);
          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
            var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
            var(--tw-drop-shadow);
        }
      `)
    })
  })

  it('should be possible to define dropShadow as an array of strings', () => {
    let config = {
      content: [{ raw: html`<div class="drop-shadow-foo"></div>` }],
      theme: {
        dropShadow: {
          foo: [
            '0px 10px 10px #000',
            '10px 0px 10px #000',
            '10px 10xp 10px #000',
            '10px 10px 0px #000',
          ],
        },
      },
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities;', config).then((result) => {
      expect(result.css).toMatchCss(css`
        .drop-shadow-foo {
          --tw-drop-shadow: drop-shadow(0px 10px 10px #000) drop-shadow(10px 0px 10px #000)
            drop-shadow(10px 10xp 10px #000) drop-shadow(10px 10px 0px #000);
          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
            var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
            var(--tw-drop-shadow);
        }
      `)
    })
  })
})
