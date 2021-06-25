import postcss from 'postcss'
import path from 'path'
import tailwind from '../../src/jit/index.js'

function run(input, config = {}) {
  const { currentTestName } = expect.getState()

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('basic ring width', async () => {
  let config = {
    mode: 'jit',
    purge: [
      {
        raw: '<div class="bad-variant:ring ring ring-2 ring-4 ring-blue-500 ring-offset-2 ring-offset-blue-100"></div>',
      },
    ],
    corePlugins: ['ringColor', 'ringOffsetColor', 'ringOffsetWidth', 'ringOpacity', 'ringWidth'],
    theme: {},
    plugins: [],
  }

  let css = `
    @tailwind base;
    @tailwind utilities
  `

  return run(css, config).then((result) => {
    expect(result.css).toMatchFormattedCss(`
      .ring,
      .ring-2,
      .ring-4 {
        --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
        --tw-ring-offset-width: 0px;
        --tw-ring-offset-color: #fff;
        --tw-ring-color: rgba(59, 130, 246, 0.5);
        --tw-ring-offset-shadow: 0 0 #0000;
        --tw-ring-shadow: 0 0 #0000;
        --tw-shadow: 0 0 #0000;
      }
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
      }
      .ring-2 {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
      }
      .ring-4 {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
      }
      .ring-blue-500 {
        --tw-ring-opacity: 1;
        --tw-ring-color: rgba(59, 130, 246, var(--tw-ring-opacity));
      }
      .ring-offset-2 {
        --tw-ring-offset-width: 2px;
      }
      .ring-offset-blue-100 {
        --tw-ring-offset-color: #dbeafe;
      }
    `)
  })
})
