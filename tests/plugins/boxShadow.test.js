import { crosscheck, run, html, css } from '../util/run'

crosscheck(() => {
  it('should be possible to define boxShadow as a string', () => {
    let config = {
      content: [{ raw: html`<div class="shadow-foo"></div>` }],
      theme: {
        boxShadow: {
          foo: '0 0 0 1px #000',
        },
      },
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities;', config).then((result) => {
      expect(result.css).toMatchCss(css`
        .shadow-foo {
          --tw-shadow: 0 0 0 1px #000;
          --tw-shadow-colored: 0 0 0 1px var(--tw-shadow-color);
          box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
            var(--tw-shadow);
        }
      `)
    })
  })

  it('should be possible to define boxShadow as an array of strings', () => {
    let config = {
      content: [{ raw: html`<div class="shadow-foo"></div>` }],
      theme: {
        boxShadow: {
          foo: ['0 0 0 1px #000', '1px 0 0 1px #000', '0 1px 0 1px #000', '1px 1px 0 1px #000'],
        },
      },
      corePlugins: { preflight: false },
    }

    return run('@tailwind utilities;', config).then((result) => {
      expect(result.css).toMatchCss(css`
        .shadow-foo {
          --tw-shadow: 0 0 0 1px #000, 1px 0 0 1px #000, 0 1px 0 1px #000, 1px 1px 0 1px #000;
          --tw-shadow-colored: 0 0 0 1px var(--tw-shadow-color), 1px 0 0 1px var(--tw-shadow-color),
            0 1px 0 1px var(--tw-shadow-color), 1px 1px 0 1px var(--tw-shadow-color);
          box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
            var(--tw-shadow);
        }
      `)
    })
  })
})
