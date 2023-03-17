import { crosscheck, run, html, css } from '../util/run'

crosscheck(() => {
  test('arbitrary list-style-type values use the list-style-type property', () => {
    let config = {
      content: [{ raw: html`<div class="list-[upper-roman]"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-\[upper-roman\] {
          list-style-type: upper-roman;
        }
      `)
    })
  })

  test('hinting arbitrary values with `url` uses the list-style-image property', () => {
    let config = {
      content: [{ raw: html`<div class="list-[url:var(--my-var)]"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-\[url\:var\(--my-var\)\] {
          list-style-image: var(--my-var);
        }
      `)
    })
  })

  test('hinting arbitrary values with `image` uses the list-style-image property', () => {
    let config = {
      content: [{ raw: html`<div class="list-[image:var(--my-var)]"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-\[image\:var\(--my-var\)\] {
          list-style-image: var(--my-var);
        }
      `)
    })
  })
})
