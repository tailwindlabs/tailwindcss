import { crosscheck, run, html, css } from './util/run'

function customTransformer(content) {
  return content.replace(/uppercase/g, 'lowercase')
}

crosscheck(({ stable, oxide }) => {
  oxide.test.todo('transform function')
  stable.test('transform function', () => {
    let config = {
      content: {
        files: [{ raw: html`<div class="uppercase"></div>` }],
        transform: customTransformer,
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .lowercase {
          text-transform: lowercase;
        }
      `)
    })
  })

  oxide.test.todo('transform.DEFAULT')
  stable.test('transform.DEFAULT', () => {
    let config = {
      content: {
        files: [{ raw: html`<div class="uppercase"></div>` }],
        transform: {
          DEFAULT: customTransformer,
        },
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .lowercase {
          text-transform: lowercase;
        }
      `)
    })
  })

  oxide.test.todo('transform.{extension}')
  stable.test('transform.{extension}', () => {
    let config = {
      content: {
        files: [
          { raw: 'blah blah blah', extension: 'html' },
          { raw: 'blah blah blah', extension: 'php' },
        ],
        transform: {
          html: () => 'uppercase',
          php: () => 'lowercase',
        },
      },
    }

    return run('@tailwind utilities', config).then((result) => {
      expect(result.css).toMatchFormattedCss(css`
        .uppercase {
          text-transform: uppercase;
        }
        .lowercase {
          text-transform: lowercase;
        }
      `)
    })
  })
})
