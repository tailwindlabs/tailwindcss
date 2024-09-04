import fs from 'fs'
import path from 'path'
import { run, html, css, defaults } from './util/run'

test('basic usage', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="sr-only"></div>
          <div class="content-center"></div>
          <div class="items-start"></div>
          <div class="self-end"></div>
          <div class="animate-none"></div>
          <div class="animate-spin"></div>
          <div class="appearance-none"></div>
          <div class="bg-local"></div>
          <div class="bg-clip-border"></div>
          <div class="bg-green-500"></div>
          <div class="bg-gradient-to-r"></div>
          <div class="bg-opacity-20"></div>
          <div class="bg-top"></div>
          <div class="bg-no-repeat"></div>
          <div class="bg-cover"></div>
          <div class="bg-origin-border bg-origin-padding bg-origin-content"></div>
          <div class="border-collapse"></div>
          <div class="border-spacing-4 border-spacing-x-6 border-spacing-y-8"></div>
          <div
            class="border-black border-t-black border-r-black border-b-black border-l-black border-x-black border-y-black"
          ></div>
          <div class="border-opacity-10"></div>
          <div class="rounded-md"></div>
          <div class="border-solid border-hidden"></div>
          <div class="border"></div>
          <div class="border-2 border-t border-b-4 border-x-4 border-y-4"></div>
          <div class="shadow shadow-md shadow-lg"></div>
          <div class="shadow-black shadow-red-500/25 shadow-blue-100/10"></div>
          <div class="decoration-clone decoration-slice"></div>
          <div class="box-decoration-clone box-decoration-slice"></div>
          <div class="box-border"></div>
          <div class="clear-left"></div>
          <div class="container"></div>
          <div class="cursor-pointer"></div>
          <div class="touch-pan-y touch-manipulation"></div>
          <div class="hidden inline-grid"></div>
          <div class="divide-gray-200"></div>
          <div class="divide-opacity-50"></div>
          <div class="divide-dotted"></div>
          <div class="divide-x-2 divide-y-4 divide-x-0 divide-y-0"></div>
          <div class="fill-current"></div>
          <div class="flex-1"></div>
          <div class="flex-row-reverse"></div>
          <div class="flex-grow flex-grow-0"></div>
          <div class="grow grow-0"></div>
          <div class="flex-shrink flex-shrink-0"></div>
          <div class="shrink shrink-0"></div>
          <div class="basis-auto basis-7"></div>
          <div class="flex-wrap"></div>
          <div class="float-right"></div>
          <div class="font-sans"></div>
          <div class="text-2xl"></div>
          <div class="antialiased"></div>
          <div class="not-italic"></div>
          <div class="tabular-nums ordinal diagonal-fractions"></div>
          <div class="font-medium"></div>
          <div class="gap-x-2 gap-y-3 gap-4"></div>
          <div class="from-red-300 via-purple-200 to-blue-400"></div>
          <div class="columns-1 columns-md"></div>
          <div class="break-before-page break-inside-avoid-column break-after-auto"></div>
          <div class="auto-cols-min"></div>
          <div class="grid-flow-row"></div>
          <div class="auto-rows-max"></div>
          <div class="col-span-3"></div>
          <div class="col-start-1"></div>
          <div class="col-end-4"></div>
          <div class="row-span-2"></div>
          <div class="row-start-3"></div>
          <div class="row-end-5"></div>
          <div class="grid-cols-4"></div>
          <div class="grid-rows-3"></div>
          <div class="h-16"></div>
          <div class="inset-0 inset-y-4 inset-x-2 top-6 right-8 bottom-12 left-16"></div>
          <div class="isolate isolation-auto"></div>
          <div class="justify-center"></div>
          <div class="justify-items-end"></div>
          <div class="justify-self-start"></div>
          <div class="tracking-tight"></div>
          <div class="leading-relaxed leading-5"></div>
          <div class="list-inside"></div>
          <div class="list-disc"></div>
          <div class="list-image-none"></div>
          <div class="m-4 my-2 mx-auto mt-0 mr-1 mb-3 ml-4"></div>
          <div class="h-0 h-full h-screen h-svh h-lvh h-dvh"></div>
          <div class="max-h-0 max-h-full max-h-screen max-h-svh max-h-lvh max-h-dvh"></div>
          <div class="max-w-full"></div>
          <div class="min-h-0 min-h-full min-h-0 min-h-svh min-h-lvh min-h-dvh"></div>
          <div class="min-w-min"></div>
          <div class="object-cover"></div>
          <div class="object-bottom"></div>
          <div class="opacity-90"></div>
          <div class="bg-blend-darken bg-blend-difference"></div>
          <div class="mix-blend-multiply mix-blend-saturation"></div>
          <div class="order-last order-2"></div>
          <div
            class="outline outline-dashed outline-none outline-black outline-4 outline-offset-2 -outline-offset-2"
          ></div>
          <div class="overflow-hidden"></div>
          <div class="overscroll-contain"></div>
          <div class="p-4 py-2 px-3 pt-1 pr-2 pb-3 pl-4"></div>
          <div class="place-content-start"></div>
          <div class="placeholder-green-300"></div>
          <div class="placeholder-opacity-60"></div>
          <div class="caret-red-600"></div>
          <div class="accent-red-600"></div>
          <div class="place-items-end"></div>
          <div class="place-self-center"></div>
          <div class="pointer-events-none"></div>
          <div class="absolute"></div>
          <div class="resize-none"></div>
          <div class="snap-x snap-mandatory"></div>
          <div class="snap-center snap-always"></div>
          <div class="scroll-mt-6"></div>
          <div class="scroll-p-6"></div>
          <div class="ring-white"></div>
          <div class="ring-offset-blue-300"></div>
          <div class="ring-offset-2"></div>
          <div class="ring-opacity-40"></div>
          <div class="ring ring-4"></div>
          <div
            class="
              filter filter-none
              blur-md blur-none
              brightness-150
              contrast-50
              drop-shadow-md
              grayscale
              hue-rotate-60
              invert
              saturate-200
              sepia
            "
          ></div>
          <div
            class="
              backdrop-filter
              backdrop-filter-none
              backdrop-blur-lg backdrop-blur-none
              backdrop-brightness-50
              backdrop-contrast-0
              backdrop-grayscale
              backdrop-hue-rotate-90
              backdrop-invert
              backdrop-opacity-75
              backdrop-saturate-150
              backdrop-sepia
            "
          ></div>
          <div class="rotate-3"></div>
          <div class="scale-95 -scale-x-100"></div>
          <div class="skew-y-12 skew-x-12"></div>
          <div class="space-x-4 space-y-3 space-x-reverse space-y-reverse"></div>
          <div class="stroke-current"></div>
          <div class="stroke-2"></div>
          <div class="table-fixed"></div>
          <div class="caption-top"></div>
          <div class="caption-bottom"></div>
          <div class="text-center"></div>
          <div class="indent-6 -indent-12"></div>
          <div class="text-indigo-500"></div>
          <div class="text-opacity-10"></div>
          <div class="underline"></div>
          <div class="decoration-underline"></div>
          <div class="decoration-red-600"></div>
          <div class="decoration-solid"></div>
          <div class="decoration-1"></div>
          <div class="decoration-2"></div>
          <div class="underline-offset-1"></div>
          <div class="underline-offset-2"></div>
          <div class="underline-right"></div>
          <div class="overflow-ellipsis truncate"></div>
          <div class="uppercase"></div>
          <div class="transform transform-gpu transform-none"></div>
          <div class="origin-top-right"></div>
          <div class="delay-300"></div>
          <div class="duration-200"></div>
          <div class="transition transition-all"></div>
          <div class="ease-in-out"></div>
          <div class="translate-x-5 -translate-x-4 translate-y-6 -translate-x-3"></div>
          <div class="touch-pan-up touch-pan-x touch-pinch-zoom"></div>
          <div class="select-none"></div>
          <div class="align-middle"></div>
          <div class="invisible"></div>
          <div class="collapse"></div>
          <div class="whitespace-nowrap"></div>
          <div class="text-wrap text-balance text-nowrap"></div>
          <div class="w-12"></div>
          <div class="break-words"></div>
          <div class="z-30"></div>
          <div class="will-change-scroll will-change-transform"></div>
          <div class="content-none"></div>
          <div class="aspect-square aspect-video"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(
      fs.readFileSync(path.resolve(__dirname, './basic-usage.test.css'), 'utf8')
    )
  })
})

test('all plugins are executed that match a candidate', () => {
  let config = {
    content: [{ raw: html`<div class="bg-green-light bg-green"></div>` }],
    theme: {
      colors: {
        green: {
          light: 'green',
        },
      },
    },
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;

    .bg-green {
      /* Empty on purpose */
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-green-light {
        --tw-bg-opacity: 1;
        background-color: rgb(0 128 0 / var(--tw-bg-opacity));
      }
    `)
  })
})

test('per-plugin colors with the same key can differ when using a custom colors object', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="bg-theme text-theme">This should be green text on red background.</div>
        `,
      },
    ],
    theme: {
      // colors & theme MUST be plain objects
      // If they're functions here the test passes regardless
      colors: {
        theme: {
          bg: 'red',
          text: 'green',
        },
      },
      extend: {
        textColor: {
          theme: {
            DEFAULT: 'green',
          },
        },
        backgroundColor: {
          theme: {
            DEFAULT: 'red',
          },
        },
      },
    },
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-theme {
        --tw-bg-opacity: 1;
        background-color: rgb(255 0 0 / var(--tw-bg-opacity));
      }
      .text-theme {
        --tw-text-opacity: 1;
        color: rgb(0 128 0 / var(--tw-text-opacity));
      }
    `)
  })
})

test('default ring color can be a function', () => {
  function color(variable) {
    return function ({ opacityVariable, opacityValue }) {
      if (opacityValue !== undefined) {
        return `rgba(${variable}, ${opacityValue})`
      }
      if (opacityVariable !== undefined) {
        return `rgba(${variable}, var(${opacityVariable}, 1))`
      }
      return `rgb(${variable})`
    }
  }

  let config = {
    content: [
      {
        raw: html` <div class="ring"></div> `,
      },
    ],

    theme: {
      extend: {
        ringColor: {
          DEFAULT: color('var(--red)'),
        },
      },
    },
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: 'rgba(var(--red), 0.5)' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('falsy config values still work', () => {
  let config = {
    content: [{ raw: html`<div class="inset-0"></div>` }],
    theme: {
      inset: {
        0: 0,
      },
    },
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .inset-0 {
        inset: 0;
      }
    `)
  })
})

it('shadows support values without a leading zero', () => {
  let config = {
    content: [{ raw: html`<div class="shadow-one shadow-two"></div>` }],
    theme: {
      boxShadow: {
        one: '0.5rem 0.5rem 0.5rem #0005',
        two: '.5rem .5rem .5rem #0005',
      },
    },
    plugins: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .shadow-one,
      .shadow-two {
        --tw-shadow: 0.5rem 0.5rem 0.5rem #0005;
        --tw-shadow-colored: 0.5rem 0.5rem 0.5rem var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
    `)
  })
})

it('can scan extremely long classes without crashing', () => {
  let val = 'cols-' + '-a'.repeat(65536)
  let config = {
    content: [{ raw: html`<div class="${val}"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css``)
  })
})

it('does not produce duplicate output when seeing variants preceding a wildcard (*)', () => {
  let config = {
    content: [{ raw: html`underline focus:*` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    * {
      color: red;
    }

    .combined,
    * {
      text-align: center;
    }

    @layer base {
      * {
        color: blue;
      }

      .combined,
      * {
        color: red;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      * {
        color: #00f;
      }
      .combined,
      * {
        color: red;
      }
      ${defaults}
      .underline {
        text-decoration-line: underline;
      }
      * {
        color: red;
      }
      .combined,
      * {
        text-align: center;
      }
    `)
  })
})

it('can parse box shadows with variables', () => {
  let config = {
    content: [{ raw: html`<div class="shadow-lg"></div>` }],
    theme: {
      boxShadow: {
        lg: 'var(--a, 0 35px 60px -15px rgba(0, 0, 0)), 0 0 1px rgb(0, 0, 0)',
      },
    },
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .shadow-lg {
        --tw-shadow: var(--a, 0 35px 60px -15px #000), 0 0 1px #000;
        --tw-shadow-colored: 0 35px 60px -15px var(--tw-shadow-color),
          0 0 1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
    `)
  })
})

it('should generate styles using :not(.unknown-class) even if `.unknown-class` does not exist', () => {
  let config = {
    content: [{ raw: html`<div></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind components;

    @layer components {
      div:not(.unknown-class) {
        color: red;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      div:not(.unknown-class) {
        color: red;
      }
    `)
  })
})

it('supports multiple backgrounds as arbitrary values even if only some are quoted', () => {
  let config = {
    content: [
      {
        raw: html`<div
          class="bg-[url('/images/one-two-three.png'),linear-gradient(to_right,_#eeeeee,_#000000)]"
        ></div>`,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .bg-\[url\(\'\/images\/one-two-three\.png\'\)\,linear-gradient\(to_right\,_\#eeeeee\,_\#000000\)\] {
        background-image: url('/images/one-two-three.png'), linear-gradient(to right, #eee, #000);
      }
    `)
  })
})

it('The "default" ring opacity is used by the default ring color when not using respectDefaultRingColorOpacity (1)', () => {
  let config = {
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#3b82f680' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('The "default" ring opacity is used by the default ring color when not using respectDefaultRingColorOpacity (2)', () => {
  let config = {
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringOpacity: {
        DEFAULT: 0.75,
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#3b82f6bf' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('Customizing the default ring color uses the "default" opacity when not using respectDefaultRingColorOpacity (1)', () => {
  let config = {
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringColor: {
        DEFAULT: '#ff7f7f',
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#ff7f7f80' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('Customizing the default ring color uses the "default" opacity when not using respectDefaultRingColorOpacity (2)', () => {
  let config = {
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringColor: {
        DEFAULT: '#ff7f7f00',
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#ff7f7f80' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('The "default" ring color ignores the default opacity when using respectDefaultRingColorOpacity (1)', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#3b82f67f' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('The "default" ring color ignores the default opacity when using respectDefaultRingColorOpacity (2)', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringOpacity: {
        DEFAULT: 0.75,
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#3b82f67f' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('Customizing the default ring color preserves its opacity when using respectDefaultRingColorOpacity (1)', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringColor: {
        DEFAULT: '#ff7f7f',
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#ff7f7f' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('Customizing the default ring color preserves its opacity when using respectDefaultRingColorOpacity (2)', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringColor: {
        DEFAULT: '#ff7f7f00',
      },
    },
  }

  let input = css`
    @tailwind base;
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      ${defaults({ defaultRingColor: '#ff7f7f00' })}
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
    `)
  })
})

it('A bare ring-opacity utility is not supported when not using respectDefaultRingColorOpacity', () => {
  let config = {
    content: [{ raw: html`<div class="ring-opacity"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringOpacity: {
        DEFAULT: '0.33',
      },
    },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css``)
  })
})

test('A bare ring-opacity utility is supported when using respectDefaultRingColorOpacity', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring-opacity"></div>` }],
    corePlugins: { preflight: false },
    theme: {
      ringOpacity: {
        DEFAULT: '0.33',
      },
    },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .ring-opacity {
        --tw-ring-opacity: 0.33;
      }
    `)
  })
})

it('Ring color utilities are generated when using respectDefaultRingColorOpacity', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [{ raw: html`<div class="ring ring-blue-500"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .ring {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
          var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
          var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
      .ring-blue-500 {
        --tw-ring-opacity: 1;
        --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
      }
    `)
  })
})

test('should not crash when group names contain special characters', () => {
  let config = {
    future: { respectDefaultRingColorOpacity: true },
    content: [
      {
        raw: '<div class="group/${id}"><div class="group-hover/${id}:visible"></div></div>',
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .group\/\$\{id\}:hover .group-hover\/\$\{id\}\:visible {
        visibility: visible;
      }
    `)
  })
})

it('should not crash when matching variants where utility classes are doubled up', () => {
  let config = {
    content: [
      {
        raw: '<div class="hover:foo"></div>',
      },
    ],
  }

  let input = css`
    @tailwind utilities;
    @layer utilities {
      .foo.foo {
        text-decoration-line: underline;
      }
    }
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .hover\:foo:hover.hover\:foo:hover {
        text-decoration-line: underline;
      }
    `)
  })
})

test('detects quoted arbitrary values containing a slash', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="group-[[href^='/']]:hidden"></div>`,
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .group[href^='/'] .group-\[\[href\^\=\'\/\'\]\]\:hidden {
      display: none;
    }
  `)
})

test('handled quoted arbitrary values containing escaped spaces', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="group-[[href^='_bar']]:hidden"></div>`,
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    .group[href^=' bar'] .group-\[\[href\^\=\'_bar\'\]\]\:hidden {
      display: none;
    }
  `)
})

test('detects quoted arbitrary values containing a slash', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="group-[[href^='/']]:hidden"></div>`,
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(
    css`
      .group[href^='/'] .group-\[\[href\^\=\'\/\'\]\]\:hidden {
        display: none;
      }
    `
  )
})

test('handled quoted arbitrary values containing escaped spaces', async () => {
  let config = {
    content: [
      {
        raw: html`<div class="group-[[href^='_bar']]:hidden"></div>`,
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(
    css`
      .group[href^=' bar'] .group-\[\[href\^\=\'_bar\'\]\]\:hidden {
        display: none;
      }
    `
  )
})

test('Skips classes inside :not() when nested inside an at-rule', async () => {
  let config = {
    content: [
      {
        raw: html` <div class="disabled !disabled"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.hand:not(.disabled)': {
            '@supports (cursor: pointer)': {
              cursor: 'pointer',
            },
          },
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  // We didn't find the hand class therefore
  // nothing should be generated
  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css``)
})

test('Irrelevant rules are removed when applying variants', async () => {
  let config = {
    content: [
      {
        raw: html` <div class="md:w-full"></div> `,
      },
    ],
    corePlugins: { preflight: false },
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '@supports (foo: bar)': {
            // This doesn't contain `w-full` so it should not exist in the output
            '.outer': { color: 'red' },
            '.outer:is(.w-full)': { color: 'green' },
          },
        })
      },
    ],
  }

  let input = css`
    @tailwind utilities;
  `

  // We didn't find the hand class therefore
  // nothing should be generated
  let result = await run(input, config)

  expect(result.css).toMatchFormattedCss(css`
    @media (min-width: 768px) {
      .md\:w-full {
        width: 100%;
      }
      @supports (foo: bar) {
        .outer.md\:w-full {
          color: green;
        }
      }
    }
  `)
})
