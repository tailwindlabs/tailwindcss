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

it('should support arbitrary values for various background utilities', () => {
  let config = {
    content: [
      {
        raw: html`
          <!-- Lookup -->
          <div class="bg-gradient-to-r"></div>
          <div class="bg-red-500"></div>

          <!-- By implicit type -->
          <div class="bg-[url('/image-1-0.png')]"></div>
          <div class="bg-[#ff0000]"></div>

          <!-- By explicit type -->
          <div class="bg-[url:var(--image-url)]"></div>
          <div class="bg-[color:var(--bg-color)]"></div>
        `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .bg-red-500 {
        --tw-bg-opacity: 1;
        background-color: rgb(239 68 68 / var(--tw-bg-opacity));
      }

      .bg-\\[\\#ff0000\\] {
        --tw-bg-opacity: 1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
      }

      .bg-\\[color\\:var\\(--bg-color\\)\\] {
        background-color: var(--bg-color);
      }

      .bg-gradient-to-r {
        background-image: linear-gradient(to right, var(--tw-gradient-stops));
      }

      .bg-\\[url\\(\\'\\/image-1-0\\.png\\'\\)\\] {
        background-image: url('/image-1-0.png');
      }

      .bg-\\[url\\:var\\(--image-url\\)\\] {
        background-image: var(--image-url);
      }
    `)
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
          <div class="content-[___abc____]"></div>
          <div class="content-['__hello__world__']"></div>
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

      .content-\\[___abc____\\] {
        content: abc;
      }

      .content-\\[\\'__hello__world__\\'\\] {
        content: '  hello  world  ';
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
