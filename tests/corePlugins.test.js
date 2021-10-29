import postcss from 'postcss'
import tailwind from '../src/index'

function run(input, config = {}) {
  return postcss([tailwind(config)]).process(input, { from: undefined })
}

it('should not change the order of the plugins based on corePlugins in config', async () => {
  let config1 = {
    purge: {
      enabled: true,
      content: [{ raw: `<div class="transform translate-x-full"></div>` }],
    },
    corePlugins: ['translate', 'transform'],
  }
  let config2 = {
    purge: {
      enabled: true,
      content: [{ raw: `<div class="transform translate-x-full"></div>` }],
    },
    corePlugins: ['transform', 'translate'],
  }

  let input = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  let [first, second] = await Promise.all([run(input, config1), run(input, config2)])
  expect(first.css).toMatchFormattedCss(second.css)
})
