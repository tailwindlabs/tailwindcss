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
        text: [
          'Nested CSS was detected, but CSS nesting has not been configured correctly.',
          'Please enable a CSS nesting plugin *before* Tailwind in your configuration.',
          'See how here: https://tailwindcss.com/docs/using-with-preprocessors#nesting',
        ].join('\n'),
      },
    ])
  })
})

it('should warn when we detect namespaced @tailwind at rules', () => {
  let config = {
    content: [{ raw: html`<div class="text-center"></div>` }],
  }

  let input = css`
    .namespace {
      @tailwind utilities;
    }
  `

  return run(input, config).then((result) => {
    expect(result.messages).toHaveLength(1)
    expect(result.messages).toMatchObject([
      {
        type: 'warning',
        text: [
          'Nested @tailwind rules were detected, but are not supported.',
          "Consider using a prefix to scope Tailwind's classes: https://tailwindcss.com/docs/configuration#prefix",
          'Alternatively, use the important selector strategy: https://tailwindcss.com/docs/configuration#selector-strategy',
        ].join('\n'),
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
