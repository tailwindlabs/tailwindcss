import { run, html, css } from './util/run'

test('defining parametric utilities in CSS', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="tab-2 md:tab-4 lg:tab-[6]"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    theme: {
      tabSize: {
        0: '0',
        2: '2',
        4: '4',
      },
    },
  }

  let input = css`
    @tailwind utilities;

    @layer utilities {
      .tab-(@size: theme(tabSize)) {
        tab-size: @size;
      }
    }
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .tab-2 {
      tab-size: 2;
    }
    @media (min-width: 768px) {
      .md\:tab-4 {
        tab-size: 4;
      }
    }
    @media (min-width: 1024px) {
      .lg\:tab-\[6\] {
        tab-size: 6;
      }
    }
  `)
})
