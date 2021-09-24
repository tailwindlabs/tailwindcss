import fs from 'fs'
import path from 'path'

import { run, html, css } from './util/run'

test('arbitrary values', () => {
  let config = {
    content: [path.resolve(__dirname, './arbitrary-values.test.html')],
  }

  return run('@tailwind utilities', config).then((result) => {
    let expectedPath = path.resolve(__dirname, './arbitrary-values.test.css')
    let expected = fs.readFileSync(expectedPath, 'utf8')

    expect(result.css).toMatchFormattedCss(expected)
  })
})

it('should not generate any css if an unknown typehint is used', () => {
  let config = {
    content: [
      {
        raw: html`<div class="inset-[hmm:12px]"></div>`,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css``)
  })
})

it('should handle unknown typehints', () => {
  let config = { content: [{ raw: html`<div class="w-[length:12px]"></div>` }] }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(`
      .w-\\[length\\:12px\\] {
        width: 12px;
      }
    `)
  })
})

it('should convert _ to spaces', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="grid-cols-[200px_repeat(auto-fill,minmax(15%,100px))_300px]"></div>
          <div class="grid-rows-[200px_repeat(auto-fill,minmax(15%,100px))_300px]"></div>
          <div class="shadow-[0px_0px_4px_black]"></div>
          <div class="rounded-[0px_4px_4px_0px]"></div>
          <div class="m-[8px_4px]"></div>
          <div class="p-[8px_4px]"></div>
          <div class="flex-[1_1_100%]"></div>
          <div class="col-[span_3_/_span_8]"></div>
          <div class="row-[span_3_/_span_8]"></div>
          <div class="auto-cols-[minmax(0,_1fr)]"></div>
          <div class="drop-shadow-[0px_1px_3px_black]"></div>
          <div class="content-[_hello_world_]"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .col-\\[span_3_\\/_span_8\\] {
        grid-column: span 3 / span 8;
      }

      .row-\\[span_3_\\/_span_8\\] {
        grid-row: span 3 / span 8;
      }

      .m-\\[8px_4px\\] {
        margin: 8px 4px;
      }

      .flex-\\[1_1_100\\%\\] {
        flex: 1 1 100%;
      }

      .auto-cols-\\[minmax\\(0\\2c _1fr\\)\\] {
        grid-auto-columns: minmax(0, 1fr);
      }

      .grid-cols-\\[200px_repeat\\(auto-fill\\2c minmax\\(15\\%\\2c 100px\\)\\)_300px\\] {
        grid-template-columns: 200px repeat(auto-fill, minmax(15%, 100px)) 300px;
      }

      .grid-rows-\\[200px_repeat\\(auto-fill\\2c minmax\\(15\\%\\2c 100px\\)\\)_300px\\] {
        grid-template-rows: 200px repeat(auto-fill, minmax(15%, 100px)) 300px;
      }

      .rounded-\\[0px_4px_4px_0px\\] {
        border-radius: 0px 4px 4px 0px;
      }

      .p-\\[8px_4px\\] {
        padding: 8px 4px;
      }

      .shadow-\\[0px_0px_4px_black\\] {
        --tw-shadow: 0px 0px 4px black;
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }

      .drop-shadow-\\[0px_1px_3px_black\\] {
        --tw-drop-shadow: drop-shadow(0px 1px 3px black);
        filter: var(--tw-filter);
      }
      .content-\\[_hello_world_\\] {
        content: hello world;
      }
    `)
  })
})

it('should not convert escaped underscores with spaces', () => {
  let config = {
    content: [{ raw: html` <div class="content-['snake\\_case']"></div> ` }],
    corePlugins: { preflight: false },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .content-\\[\\'snake\\\\_case\\'\\] {
        content: 'snake_case';
      }
    `)
  })
})
