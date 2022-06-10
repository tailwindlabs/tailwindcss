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

it('should be possible to differentiate between decoration utilities', () => {
  let config = {
    content: [
      {
        raw: html` <div class="decoration-[#ccc] decoration-[3px]"></div> `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .decoration-\[\#ccc\] {
        text-decoration-color: #ccc;
      }

      .decoration-\[3px\] {
        text-decoration-thickness: 3px;
      }
    `)
  })
})

it('should support modifiers for arbitrary values that contain the separator', () => {
  let config = {
    content: [
      {
        raw: html` <div class="hover:bg-[url('https://github.com/tailwindlabs.png')]"></div> `,
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .hover\:bg-\[url\(\'https\:\/\/github\.com\/tailwindlabs\.png\'\)\]:hover {
        background-image: url('https://github.com/tailwindlabs.png');
      }
    `)
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
          <div class="bg-[rgb(var(--bg-color))]"></div>
          <div class="bg-[hsl(var(--bg-color))]"></div>

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

      .bg-\[\#ff0000\] {
        --tw-bg-opacity: 1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
      }

      .bg-\[rgb\(var\(--bg-color\)\)\] {
        background-color: rgb(var(--bg-color));
      }

      .bg-\[hsl\(var\(--bg-color\)\)\] {
        background-color: hsl(var(--bg-color));
      }

      .bg-\[color\:var\(--bg-color\)\] {
        background-color: var(--bg-color);
      }

      .bg-gradient-to-r {
        background-image: linear-gradient(to right, var(--tw-gradient-stops));
      }

      .bg-\[url\(\'\/image-1-0\.png\'\)\] {
        background-image: url('/image-1-0.png');
      }

      .bg-\[url\:var\(--image-url\)\] {
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
    return expect(result.css).toMatchFormattedCss(css`
      .w-\[length\:12px\] {
        width: 12px;
      }
    `)
  })
})

it('should convert _ to spaces', () => {
  // Using custom css function here, because otherwise with String.raw, we run
  // into an issue with `\2c ` escapes. If we use `\2c ` then JS complains
  // about strict mode. But `\\2c ` is not what it expected.
  function css(templates) {
    return templates.join('')
  }

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
        --tw-shadow-colored: 0px 0px 4px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }

      .drop-shadow-\\[0px_1px_3px_black\\] {
        --tw-drop-shadow: drop-shadow(0px 1px 3px black);
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }

      .content-\\[_hello_world_\\] {
        --tw-content: hello world;
        content: var(--tw-content);
      }

      .content-\\[___abc____\\] {
        --tw-content: abc;
        content: var(--tw-content);
      }

      .content-\\[\\'__hello__world__\\'\\] {
        --tw-content: '  hello  world  ';
        content: var(--tw-content);
      }
    `)
  })
})

it('should not convert escaped underscores with spaces', () => {
  let config = {
    content: [{ raw: `<div class="content-['snake\\_case']"></div>` }],
    corePlugins: { preflight: false },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .content-\[\'snake\\_case\'\] {
        --tw-content: 'snake_case';
        content: var(--tw-content);
      }
    `)
  })
})

it('should warn and not generate if arbitrary values are ambiguous', () => {
  // If we don't protect against this, then `bg-[200px_100px]` would both
  // generate the background-size as well as the background-position utilities.
  let config = {
    content: [{ raw: html`<div class="bg-[200px_100px]"></div>` }],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css``)
  })
})

it('should support colons in URLs', () => {
  let config = {
    content: [
      { raw: html`<div class="bg-[url('https://www.spacejam.com/1996/img/bg_stars.gif')]"></div>` },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .bg-\[url\(\'https\:\/\/www\.spacejam\.com\/1996\/img\/bg_stars\.gif\'\)\] {
        background-image: url('https://www.spacejam.com/1996/img/bg_stars.gif');
      }
    `)
  })
})

it('should support unescaped underscores in URLs', () => {
  let config = {
    content: [
      { raw: html`<div class="bg-[url('brown_potato.jpg'),_url('red_tomato.png')]"></div>` },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(`
      .bg-\\[url\\(\\'brown_potato\\.jpg\\'\\)\\2c _url\\(\\'red_tomato\\.png\\'\\)\\] {
        background-image: url('brown_potato.jpg'), url('red_tomato.png');
      }
    `)
  })
})

it('should be possible to read theme values in arbitrary values (without quotes)', () => {
  let config = {
    content: [{ raw: html`<div class="w-[theme(spacing.1)] w-[theme(spacing[0.5])]"></div>` }],
    theme: {
      spacing: {
        0.5: 'calc(.5 * .25rem)',
        1: 'calc(1 * .25rem)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .w-\[theme\(spacing\.1\)\] {
        width: calc(1 * 0.25rem);
      }
      .w-\[theme\(spacing\[0\.5\]\)\] {
        width: calc(0.5 * 0.25rem);
      }
    `)
  })
})

it('should be possible to read theme values in arbitrary values (with quotes)', () => {
  let config = {
    content: [{ raw: html`<div class="w-[theme('spacing.1')] w-[theme('spacing[0.5]')]"></div>` }],
    theme: {
      spacing: {
        0.5: 'calc(.5 * .25rem)',
        1: 'calc(1 * .25rem)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .w-\[theme\(\'spacing\.1\'\)\] {
        width: calc(1 * 0.25rem);
      }
      .w-\[theme\(\'spacing\[0\.5\]\'\)\] {
        width: calc(0.5 * 0.25rem);
      }
    `)
  })
})

it('should be possible to read theme values in arbitrary values (with quotes) when inside calc or similar functions', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="w-[calc(100%-theme('spacing.1'))] w-[calc(100%-theme('spacing[0.5]'))]"
        ></div>`,
      },
    ],
    theme: {
      spacing: {
        0.5: 'calc(.5 * .25rem)',
        1: 'calc(1 * .25rem)',
      },
    },
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(css`
      .w-\[calc\(100\%-theme\(\'spacing\.1\'\)\)\] {
        width: calc(100% - calc(1 * 0.25rem));
      }
      .w-\[calc\(100\%-theme\(\'spacing\[0\.5\]\'\)\)\] {
        width: calc(100% - calc(0.5 * 0.25rem));
      }
    `)
  })
})

it('should not output unparsable arbitrary CSS values', () => {
  let config = {
    content: [
      {
        raw: 'let classes = `w-[${sizes.width}]`',
      },
    ],
  }

  return run('@tailwind utilities', config).then((result) => {
    return expect(result.css).toMatchFormattedCss(``)
  })
})

// Issue: https://github.com/tailwindlabs/tailwindcss/issues/7997
// `top_right_50%` was a valid percentage before introducing this change
it('should correctly validate each part when checking for `percentage` data types', () => {
  let config = {
    content: [{ raw: html`<div class="bg-[top_right_50%]"></div>` }],
    corePlugins: { preflight: false },
    plugins: [],
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-\[top_right_50\%\] {
        background-position: top right 50%;
      }
    `)
  })
})
