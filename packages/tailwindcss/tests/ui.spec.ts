import { expect, test, type Page } from '@playwright/test'
import { IO, Parsing, scanFiles } from '@tailwindcss/oxide'
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
  ['from-red-500', 'linear-gradient(to right, rgb(239, 68, 68) 0%, rgba(0, 0, 0, 0) 100%)'],
  [
    'via-red-500',
    'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(239, 68, 68) 50%, rgba(0, 0, 0, 0) 100%)',
  ],
  ['to-red-500', 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(239, 68, 68) 100%)'],
  [
    'from-red-500 to-blue-500',
    'linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(59, 130, 246) 100%)',
  ],
  [
    'via-red-500 to-blue-500',
    'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(239, 68, 68) 50%, rgb(59, 130, 246) 100%)',
  ],
  [
    'from-red-500 via-green-500 to-blue-500',
    'linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(34, 197, 94) 50%, rgb(59, 130, 246) 100%)',
  ],
]) {
  test(`background gradient, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="bg-gradient-to-r ${classes}">Hello world</div>`,
    )

    expect(await getPropertyValue('#x', 'background-image')).toEqual(expected)
  })
}

test('background gradient, going from 2 to 3', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="bg-gradient-to-r from-red-500 hover:via-green-500 to-blue-500">
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(59, 130, 246) 100%)',
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(34, 197, 94) 50%, rgb(59, 130, 246) 100%)',
  )
})

test('background gradient, going from 3 to 2', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="bg-gradient-to-r from-red-500 via-green-500 hover:via-none to-blue-500">
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(34, 197, 94) 50%, rgb(59, 130, 246) 100%)',
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(59, 130, 246) 100%)',
  )
})

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
      <div id="x" class="shadow shadow-red-500"></div>
      <div id="y" class="shadow-xl shadow-red-500"></div>
    `,
  )

  expect(await getPropertyValue('#x', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgb(239, 68, 68) 0px 1px 3px 0px, rgb(239, 68, 68) 0px 1px 2px -1px',
    ].join(', '),
  )
  expect(await getPropertyValue('#y', 'box-shadow')).toEqual(
    [
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
      'rgb(239, 68, 68) 0px 20px 25px -5px, rgb(239, 68, 68) 0px 8px 10px -6px',
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

// ---

const preflight = fs.readFileSync(path.resolve(__dirname, '..', 'preflight.css'), 'utf-8')
const defaultTheme = fs.readFileSync(path.resolve(__dirname, '..', 'theme.css'), 'utf-8')
async function render(page: Page, content: string) {
  await page.setContent(content)
  await page.addStyleTag({
    content: optimizeCss(
      compile(css`
        @layer theme, base, components, utilities;
        @layer theme {
          ${defaultTheme}
        }
        @layer base {
          ${preflight}
        }
        @layer utilities {
          @tailwind utilities;
        }
      `).build(scanFiles([{ content, extension: 'html' }], IO.Sequential | Parsing.Sequential)),
    ),
  })

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
