import { expect, test, type Page } from '@playwright/test'
import { Scanner } from '@tailwindcss/oxide'
import fs from 'fs'
import path from 'path'
import { compile } from '../src'
import { optimizeCss } from '../src/test-utils/run'

const html = String.raw
const css = String.raw

test('touch action', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="x" class="touch-pan-x touch-pan-y hover:touch-pinch-zoom">Hello world</div>`,
  )

  expect(await getPropertyValue('#x', 'touch-action')).toEqual('pan-x pan-y')

  await page.locator('#x').hover()

  expect([
    // `manipulation` is an alias for `pan-x pan-y pinch-zoom` and some engines
    // compute the combination of those three values to `manipulation` even when
    // explicitly set as three values.
    'manipulation',
    'pan-x pan-y pinch-zoom',
  ]).toContain(await getPropertyValue('#x', 'touch-action'))
})

for (let [classes, expected] of [
  [
    'bg-linear-to-r from-red',
    'linear-gradient(to right in oklch, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
  ],
  [
    'bg-linear-to-r via-red',
    'linear-gradient(to right in oklch, rgba(0, 0, 0, 0) 0%, rgb(255, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)',
  ],
  [
    'bg-linear-to-r to-red',
    'linear-gradient(to right in oklch, rgba(0, 0, 0, 0) 0%, rgb(255, 0, 0) 100%)',
  ],
  [
    'bg-linear-to-r from-red to-blue',
    'linear-gradient(to right in oklch, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
  ],
  [
    'bg-linear-45 from-red to-blue',
    'linear-gradient(45deg in oklch, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
  ],
  [
    '-bg-linear-45 from-red to-blue',
    // Chrome reports a different (but also correct) computed value than Firefox/WebKit so we check
    // for both options.
    [
      'linear-gradient(-45deg in oklch, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
      'linear-gradient(calc(-45deg) in oklch, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
    ],
  ],
  [
    'bg-linear-to-r via-red to-blue',
    'linear-gradient(to right in oklch, rgba(0, 0, 0, 0) 0%, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 100%)',
  ],
  [
    'bg-linear-to-r from-red via-green to-blue',
    'linear-gradient(to right in oklch, rgb(255, 0, 0) 0%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 100%)',
  ],
  [
    'bg-linear-[to_right,var(--color-red),var(--color-green),var(--color-blue)]',
    'linear-gradient(to right, rgb(255, 0, 0), rgb(0, 255, 0), rgb(0, 0, 255))',
  ],
]) {
  test(`background gradient, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="${classes}">Hello world</div>`,
    )

    if (Array.isArray(expected)) {
      expect(expected).toContain(await getPropertyValue('#x', 'background-image'))
    } else {
      expect(await getPropertyValue('#x', 'background-image')).toEqual(expected)
    }
  })
}

test('background gradient, going from 2 to 3', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html` <div id="x" class="bg-gradient-to-r from-red hover:via-green to-blue">Hello world</div> `,
  )

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right in oklch, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right in oklch, rgb(255, 0, 0) 0%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 100%)',
  )
})

test('background gradient, going from 3 to 2', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="bg-gradient-to-r from-red via-green hover:via-none to-blue">
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right in oklch, rgb(255, 0, 0) 0%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 100%)',
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right in oklch, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
  )
})

for (let [classes, expected] of [
  ['bg-conic from-red', 'conic-gradient(in oklch, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)'],
  [
    'bg-conic-45 from-red',
    'conic-gradient(from 45deg in oklch, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
  ],
  [
    'bg-conic-[from_45deg] from-red',
    'conic-gradient(from 45deg, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
  ],
  [
    'bg-conic-[from_45deg,var(--color-red),transparent]',
    'conic-gradient(from 45deg, rgb(255, 0, 0), rgba(0, 0, 0, 0))',
  ],
]) {
  test(`conic gradient, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="${classes}">Hello world</div>`,
    )

    expect(await getPropertyValue('#x', 'background-image')).toEqual(expected)
  })
}

for (let [classes, expected] of [
  ['bg-radial from-red', 'radial-gradient(in oklch, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)'],
  [
    'bg-radial-[at_0%_0%] from-red',
    'radial-gradient(at 0% 0%, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
  ],
  [
    'bg-radial-[at_0%_0%,var(--color-red),transparent]',
    'radial-gradient(at 0% 0%, rgb(255, 0, 0), rgba(0, 0, 0, 0))',
  ],
]) {
  test(`radial gradient, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="${classes}">Hello world</div>`,
    )

    expect(await getPropertyValue('#x', 'background-image')).toEqual(expected)
  })
}

test("::backdrop can receive a border with just the 'border' utility", async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<dialog id="x" class="backdrop:border backdrop:border-black">Hello world</dialog>`,
  )

  await page.evaluate(() => {
    ;(document.getElementById('x') as HTMLDialogElement)!.showModal()
  })

  expect(await getPropertyValue(['#x', '::backdrop'], 'border')).toEqual('1px solid rgb(0, 0, 0)')
})

test("::first-letter can receive a border with just the 'border' utility", async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="x" class="first-letter:border first-letter:border-black">Hello world</div>`,
  )

  expect(await getPropertyValue(['#x', '::first-letter'], 'border')).toEqual(
    '1px solid rgb(0, 0, 0)',
  )
})

// `getComputedStyle` doesn't work in Chrome/Safari on `::file-selector-button`
// for some reason at the moment, so we can't actually verify the computed
// style. It does work in Firefox, so maybe we can update this one test to run
// against Firefox and let the rest run against Chrome/Safari.
test.skip("::file-selector-button can receive a border with just the 'border' utility", async ({
  page,
}) => {
  let { getPropertyValue } = await render(
    page,
    html`<input id="x" type="file" class="file:border file:border-black" />`,
  )

  expect(await getPropertyValue(['#x', '::file-selector-button'], 'border')).toEqual(
    '1px solid rgb(0, 0, 0)',
  )
})

test('composing shadow, inset shadow, ring, and inset ring', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div
      id="x"
      class="shadow shadow-[#f00]/50 inset-shadow inset-shadow-[#0f0]/50 ring ring-[#fff]/50 inset-ring inset-ring-[#00f]/50"
    ></div>`,
  )

  expect(await getPropertyValue('#x', 'box-shadow')).toEqual(
    [
      'rgba(0, 255, 0, 0.5) 0px 2px 4px 0px inset', // inset-shadow
      'rgba(0, 0, 255, 0.5) 0px 0px 0px 1px inset', // inset-ring
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px', // ring-offset (disabled)
      'rgba(255, 255, 255, 0.5) 0px 0px 0px 1px', // ring
      'rgba(255, 0, 0, 0.5) 0px 1px 3px 0px, rgba(255, 0, 0, 0.5) 0px 1px 2px -1px', // shadow
    ].join(', '),
  )
})

test('shadow colors', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="a" class="shadow shadow-red"></div>
      <div id="b" class="shadow-xl shadow-red"></div>
      <div id="c" class="shadow-[0px_2px_4px] shadow-red"></div>
      <div id="d" class="shadow shadow-red hover:shadow-xl">Hello world</div>
      <div id="e" class="shadow shadow-red hover:shadow-xl hover:shadow-initial">Hello world</div>
    `,
  )

  expect(await getPropertyValue('#a', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgb(255, 0, 0) 0px 1px 3px 0px, rgb(255, 0, 0) 0px 1px 2px -1px',
    ].join(', '),
  )
  expect(await getPropertyValue('#b', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgb(255, 0, 0) 0px 20px 25px -5px, rgb(255, 0, 0) 0px 8px 10px -6px',
    ].join(', '),
  )
  expect(await getPropertyValue('#c', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgb(255, 0, 0) 0px 2px 4px 0px',
    ].join(', '),
  )

  expect(await getPropertyValue('#d', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgb(255, 0, 0) 0px 1px 3px 0px, rgb(255, 0, 0) 0px 1px 2px -1px',
    ].join(', '),
  )

  await page.locator('#d').hover()

  expect(await getPropertyValue('#d', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgb(255, 0, 0) 0px 20px 25px -5px, rgb(255, 0, 0) 0px 8px 10px -6px',
    ].join(', '),
  )

  expect(await getPropertyValue('#e', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgb(255, 0, 0) 0px 1px 3px 0px, rgb(255, 0, 0) 0px 1px 2px -1px',
    ].join(', '),
  )

  await page.locator('#e').hover()

  expect(await getPropertyValue('#e', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px',
    ].join(', '),
  )
})

test('inset shadow colors', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="a" class="inset-shadow-sm inset-shadow-red"></div>
      <div id="b" class="inset-shadow inset-shadow-red"></div>
      <div id="c" class="inset-shadow-[0px_3px_6px] inset-shadow-red"></div>
      <div id="d" class="inset-shadow-sm inset-shadow-red hover:inset-shadow">Hello world</div>
      <div
        id="e"
        class="inset-shadow-sm inset-shadow-red hover:inset-shadow hover:inset-shadow-initial"
      >
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#a', 'box-shadow')).toEqual(
    [
      'rgb(255, 0, 0) 0px 1px 1px 0px inset',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    ].join(', '),
  )
  expect(await getPropertyValue('#b', 'box-shadow')).toEqual(
    [
      'rgb(255, 0, 0) 0px 2px 4px 0px inset',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    ].join(', '),
  )
  expect(await getPropertyValue('#c', 'box-shadow')).toEqual(
    [
      'rgb(255, 0, 0) 0px 3px 6px 0px inset',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    ].join(', '),
  )

  expect(await getPropertyValue('#d', 'box-shadow')).toEqual(
    [
      'rgb(255, 0, 0) 0px 1px 1px 0px inset',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    ].join(', '),
  )

  await page.locator('#d').hover()

  expect(await getPropertyValue('#d', 'box-shadow')).toEqual(
    [
      'rgb(255, 0, 0) 0px 2px 4px 0px inset',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    ].join(', '),
  )

  expect(await getPropertyValue('#e', 'box-shadow')).toEqual(
    [
      'rgb(255, 0, 0) 0px 1px 1px 0px inset',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    ].join(', '),
  )

  await page.locator('#e').hover()

  expect(await getPropertyValue('#e', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0.05) 0px 2px 4px 0px inset',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    ].join(', '),
  )
})

test('outline style is optional', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="x" class="outline-2 outline-white"></div>`,
  )

  expect(await getPropertyValue('#x', 'outline')).toEqual('rgb(255, 255, 255) solid 2px')
})

test('outline style is preserved when changing outline width', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="x" class="outline-2 outline-dotted outline-white hover:outline-4">
      Hello world
    </div>`,
  )

  expect(await getPropertyValue('#x', 'outline')).toEqual('rgb(255, 255, 255) dotted 2px')

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'outline')).toEqual('rgb(255, 255, 255) dotted 4px')
})

test('borders can be added without a border-style utility', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="x" class="text-black border-2"></div>`,
  )

  expect(await getPropertyValue('#x', 'border')).toEqual('2px solid rgb(0, 0, 0)')
})

test('borders can be added to a single side without a border-style utility', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="x" class="text-black border-r-2 border-dashed hover:border-r-4">
      Hello world
    </div>`,
  )
  expect(await getPropertyValue('#x', 'border-right')).toEqual('2px dashed rgb(0, 0, 0)')

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'border-right')).toEqual('4px dashed rgb(0, 0, 0)')
})

test('dividers can be added without setting border-style', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="a" class="divide-y-2 divide-dashed hover:divide-y-4">
      <div id="b">First</div>
      <div>Second</div>
    </div>`,
  )
  expect(await getPropertyValue('#b', 'border-bottom')).toEqual('2px dashed rgb(0, 0, 0)')

  await page.locator('#a').hover()

  expect(await getPropertyValue('#b', 'border-bottom')).toEqual('4px dashed rgb(0, 0, 0)')
})

test('scale can be a number or percentage', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="x" class="scale-[50%] hover:scale-[1.5]">Hello world</div>`,
  )
  expect(await getPropertyValue('#x', 'scale')).toEqual('0.5')

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'scale')).toEqual('1.5')
})

// https://github.com/tailwindlabs/tailwindcss/issues/13185
test('content-none persists when conditionally styling a pseudo-element', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`<div id="x" class="after:content-none after:hover:underline">Hello world</div>`,
  )

  expect(await getPropertyValue(['#x', '::after'], 'content')).toEqual('none')

  await page.locator('#x').hover()

  expect(await getPropertyValue(['#x', '::after'], 'content')).toEqual('none')
})

test('explicit leading utilities are respected when overriding font-size', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="text-sm hover:text-xl">Hello world</div>
      <div id="y" class="text-sm leading-tight hover:text-xl">Hello world</div>
      <div id="z" class="text-sm leading-[10px] hover:text-xl">Hello world</div>
    `,
    css`
      @theme {
        --font-size-sm: 14px;
        --font-size-sm--line-height: 16px;
        --font-size-xl: 20px;
        --font-size-xl--line-height: 24px;
        --line-height-tight: 8px;
      }
    `,
  )

  expect(await getPropertyValue('#x', 'line-height')).toEqual('16px')
  await page.locator('#x').hover()
  expect(await getPropertyValue('#x', 'line-height')).toEqual('24px')

  expect(await getPropertyValue('#y', 'line-height')).toEqual('8px')
  await page.locator('#y').hover()
  expect(await getPropertyValue('#y', 'line-height')).toEqual('8px')

  expect(await getPropertyValue('#z', 'line-height')).toEqual('10px')
  await page.locator('#z').hover()
  expect(await getPropertyValue('#z', 'line-height')).toEqual('10px')
})

test('explicit leading utilities are overridden by line-height modifiers', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="text-sm hover:text-xl/[100px]">Hello world</div>
      <div id="y" class="text-sm leading-tight hover:text-xl/[100px]">Hello world</div>
      <div id="z" class="text-sm leading-[10px] hover:text-xl/[100px]">Hello world</div>
    `,
    css`
      @theme {
        --font-size-sm: 14px;
        --font-size-sm--line-height: 16px;
        --font-size-xl: 20px;
        --font-size-xl--line-height: 24px;
        --line-height-tight: 8px;
      }
    `,
  )

  expect(await getPropertyValue('#x', 'line-height')).toEqual('16px')
  await page.locator('#x').hover()
  expect(await getPropertyValue('#x', 'line-height')).toEqual('100px')

  expect(await getPropertyValue('#y', 'line-height')).toEqual('8px')
  await page.locator('#y').hover()
  expect(await getPropertyValue('#y', 'line-height')).toEqual('100px')

  expect(await getPropertyValue('#z', 'line-height')).toEqual('10px')
  await page.locator('#z').hover()
  expect(await getPropertyValue('#z', 'line-height')).toEqual('100px')
})

test('explicit tracking utilities are respected when overriding font-size', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="text-sm hover:text-xl">Hello world</div>
      <div id="y" class="text-sm tracking-tight hover:text-xl">Hello world</div>
      <div id="z" class="text-sm tracking-[3px] hover:text-xl">Hello world</div>
    `,
    css`
      @theme {
        --font-size-sm--letter-spacing: 5px;
        --font-size-xl--letter-spacing: 10px;
        --letter-spacing-tight: 1px;
      }
    `,
  )

  expect(await getPropertyValue('#x', 'letter-spacing')).toEqual('5px')
  await page.locator('#x').hover()
  expect(await getPropertyValue('#x', 'letter-spacing')).toEqual('10px')

  expect(await getPropertyValue('#y', 'letter-spacing')).toEqual('1px')
  await page.locator('#y').hover()
  expect(await getPropertyValue('#y', 'letter-spacing')).toEqual('1px')

  expect(await getPropertyValue('#z', 'letter-spacing')).toEqual('3px')
  await page.locator('#z').hover()
  expect(await getPropertyValue('#z', 'letter-spacing')).toEqual('3px')
})

test('explicit font-weight utilities are respected when overriding font-size', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="text-sm hover:text-xl">Hello world</div>
      <div id="y" class="text-sm font-bold hover:text-xl">Hello world</div>
      <div id="z" class="text-sm font-[900] hover:text-xl">Hello world</div>
    `,
    css`
      @theme {
        --font-size-sm--font-weight: 100;
        --font-size-xl--font-weight: 200;
      }
    `,
  )

  expect(await getPropertyValue('#x', 'font-weight')).toEqual('100')
  await page.locator('#x').hover()
  expect(await getPropertyValue('#x', 'font-weight')).toEqual('200')

  expect(await getPropertyValue('#y', 'font-weight')).toEqual('700')
  await page.locator('#y').hover()
  expect(await getPropertyValue('#y', 'font-weight')).toEqual('700')

  expect(await getPropertyValue('#z', 'font-weight')).toEqual('900')
  await page.locator('#z').hover()
  expect(await getPropertyValue('#z', 'font-weight')).toEqual('900')
})

test('explicit duration and ease utilities are respected when overriding transition-property', async ({
  page,
}) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div
        id="x"
        class="ease-[linear] duration-500 transition-[opacity] hover:transition-[background-color]"
      >
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#x', 'transition-timing-function')).toEqual('linear')
  expect(await getPropertyValue('#x', 'transition-duration')).toEqual('0.5s')
  await page.locator('#x').hover()
  expect(await getPropertyValue('#x', 'transition-timing-function')).toEqual('linear')
  expect(await getPropertyValue('#x', 'transition-duration')).toEqual('0.5s')
})

// ---

const preflight = fs.readFileSync(path.resolve(__dirname, '..', 'preflight.css'), 'utf-8')
const defaultTheme = fs.readFileSync(path.resolve(__dirname, '..', 'theme.css'), 'utf-8')

async function render(page: Page, content: string, extraCss: string = '') {
  let { build } = await compile(css`
    @layer theme, base, components, utilities;
    @layer theme {
      ${defaultTheme}

      @theme {
        --color-red: rgb(255, 0, 0);
        --color-green: rgb(0, 255, 0);
        --color-blue: rgb(0, 0, 255);
      }
    }
    @layer base {
      ${preflight}
    }
    @layer utilities {
      @tailwind utilities;
    }
    ${extraCss}
  `)

  // We noticed that some of the tests depending on the `hover:` variant were
  // flaky. After some investigation, we found that injected elements had the
  // `:hover` state without us explicitly hovering over the element.
  //
  // To avoid this, we now set up an explicit placeholder element to move the
  // mouse to before running the tests.
  content = `<div id="mouse-park" class="size-12"></div>${content}`

  await page.setContent(content)

  let scanner = new Scanner({})
  let candidates = scanner.scanFiles([{ content, extension: 'html' }])

  await page.addStyleTag({
    content: optimizeCss(build(candidates)),
  })

  await page.locator('#mouse-park').hover()

  return {
    getPropertyValue(selector: string | [string, string], property: string) {
      return getPropertyValue(
        page,
        Array.isArray(selector) ? selector : [selector, undefined],
        property,
      )
    },
  }
}

async function getPropertyValue(
  page: Page,
  selector: [string, string | undefined],
  property: string,
) {
  return page.evaluate(
    ([[selector, pseudo], property]) => {
      return window
        .getComputedStyle(document.querySelector(selector)!, pseudo)
        .getPropertyValue(property)
    },
    [selector, property] as const,
  )
}
