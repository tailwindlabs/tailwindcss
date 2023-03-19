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

  test('`list-none` is always generated before configured listStyleImage values', () => {
    let config = {
      content: [{ raw: html`<div class="list-none list-disc list-cupcake"></div>` }],
      corePlugins: { preflight: false },
      theme: {
        listStyleImage: {
          cupcake: 'url(./cupcake.png)',
        },
      },
    }

    let input = css`
      @tailwind utilities;
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .list-none {
          list-style-type: none;
        }
        .list-disc {
          list-style-type: disc;
        }
        .list-none {
          list-style-image: none;
        }
        .list-cupcake {
          list-style-image: url('./cupcake.png');
        }
      `)
    })
  })

  test('using `list-none` with `@apply` generates the styles for both `list-none` classes', () => {
    let config = {
      content: [{ raw: html`<div class="foo"></div>` }],
      corePlugins: { preflight: false },
    }

    let input = css`
      @tailwind utilities;

      .foo {
        @apply list-none;
      }
    `

    return run(input, config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .foo {
          list-style-type: none;
          list-style-image: none;
        }
      `)
    })
  })
})
