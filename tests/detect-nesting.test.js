import { run, html, css } from './util/run'

it('should warn when we detect nested css', () => {
  let config = {
    content: [{ raw: html`<div class="nested"></div>` }],
  }

  let input = css`
    @tailwind utilities;

    .nested {
      .example {
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.messages).toHaveLength(1)
    expect(result.messages).toMatchObject([
      {
        type: 'warning',
        text: 'Nested CSS detected, checkout the docs on how to support nesting: https://tailwindcss.com/docs/using-with-preprocessors#nesting',
      },
    ])
  })
})

it('should not warn when nesting a single rule inside a media query', () => {
  let config = {
    content: [{ raw: html`<div class="nested"></div>` }],
  }

  let input = css`
    @tailwind utilities;

    @media (min-width: 768px) {
      .nested {
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.messages).toHaveLength(0)
    expect(result.messages).toEqual([])
  })
})

it('should only warn for the first detected nesting ', () => {
  let config = {
    content: [{ raw: html`<div class="nested other"></div>` }],
  }

  let input = css`
    @tailwind utilities;

    .nested {
      .example {
      }

      .other {
      }
    }

    .other {
      .example {
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.messages).toHaveLength(1)
  })
})
