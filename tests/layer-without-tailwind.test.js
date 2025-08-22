import { run, html, css } from './util/run'

test('using @layer without @tailwind', async () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
  }

  let input = css`
    @layer components {
      .foo {
        color: black;
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    '`@layer components` is used but no matching `@tailwind components` directive is present.'
  )
})

test('using @responsive without @tailwind', async () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
  }

  let input = css`
    @responsive {
      .foo {
        color: black;
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    '`@responsive` is used but `@tailwind utilities` is missing.'
  )
})

test('using @variants without @tailwind', async () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
  }

  let input = css`
    @variants hover {
      .foo {
        color: black;
      }
    }
  `

  await expect(run(input, config)).rejects.toThrowError(
    '`@variants` is used but `@tailwind utilities` is missing.'
  )
})

test('non-Tailwind @layer rules are okay', async () => {
  let config = {
    content: [{ raw: html`<div class="foo"></div>` }],
  }

  let input = css`
    @layer custom {
      .foo {
        color: black;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      @layer custom {
        .foo {
          color: #000;
        }
      }
    `)
  })
})
