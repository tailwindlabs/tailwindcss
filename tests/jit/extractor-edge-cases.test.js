import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('PHP arrays', async () => {
  let config = {
    purge: [
      {
        raw: `<h1 class="<?php echo wrap(['class' => "max-w-[16rem]"]); ?>">Hello world</h1>`,
      },
    ],
    theme: {},
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .max-w-\\[16rem\\] {
        max-width: 16rem;
      }
    `)
  })
})

test('arbitrary values with quotes', async () => {
  let config = {
    purge: [
      {
        raw: `<div class="content-['hello]']"></div>`,
      },
    ],
    theme: {},
    plugins: [],
  }

  let css = `@tailwind utilities`

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .content-\\[\\'hello\\]\\'\\] {
        content: 'hello]';
      }
    `)
  })
})
