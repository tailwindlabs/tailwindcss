import { expect, test, type Page } from '@playwright/test'
import { Scanner } from '@tailwindcss/oxide'
import fs from 'node:fs'
import path from 'node:path'
import { optimize } from '../../@tailwindcss-node/src/optimize'
import { compile } from '../src'
import { segment } from '../src/utils/segment'

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
    'linear-gradient(to right in oklab, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
  ],
  [
    'bg-linear-to-r via-red',
    'linear-gradient(to right in oklab, rgba(0, 0, 0, 0) 0%, rgb(255, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)',
  ],
  [
    'bg-linear-to-r to-red',
    'linear-gradient(to right in oklab, rgba(0, 0, 0, 0) 0%, rgb(255, 0, 0) 100%)',
  ],
  [
    'bg-linear-to-r from-red to-blue',
    'linear-gradient(to right in oklab, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
  ],
  [
    'bg-linear-45 from-red to-blue',
    'linear-gradient(45deg in oklab, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
  ],
  [
    '-bg-linear-45 from-red to-blue',
    // Chrome reports a different (but also correct) computed value than Firefox/WebKit so we check
    // for both options.
    [
      'linear-gradient(-45deg in oklab, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
      'linear-gradient(calc(-45deg) in oklab, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
    ],
  ],
  [
    'bg-linear-to-r via-red to-blue',
    'linear-gradient(to right in oklab, rgba(0, 0, 0, 0) 0%, rgb(255, 0, 0) 50%, rgb(0, 0, 255) 100%)',
  ],
  [
    'bg-linear-to-r from-red via-green to-blue',
    'linear-gradient(to right in oklab, rgb(255, 0, 0) 0%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 100%)',
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
    'linear-gradient(to right in oklab, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right in oklab, rgb(255, 0, 0) 0%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 100%)',
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
    'linear-gradient(to right in oklab, rgb(255, 0, 0) 0%, rgb(0, 255, 0) 50%, rgb(0, 0, 255) 100%)',
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'background-image')).toEqual(
    'linear-gradient(to right in oklab, rgb(255, 0, 0) 0%, rgb(0, 0, 255) 100%)',
  )
})

for (let [classes, expected] of [
  ['bg-conic from-red', 'conic-gradient(in oklab, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)'],
  [
    'bg-conic-45 from-red',
    'conic-gradient(from 45deg in oklab, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
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
  ['bg-radial from-red', 'radial-gradient(in oklab, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)'],
  [
    'bg-radial-[at_0%_0%] from-red',
    'radial-gradient(at 0% 0%, rgb(255, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)',
  ],
  [
    'bg-radial-[at_0%_0%,var(--color-red),transparent]',
    'radial-gradient(at 0% 0%, rgb(255, 0, 0), rgba(0, 0, 0, 0))',
  ],
  [
    'bg-radial-[at_center] from-red to-green',
    'radial-gradient(rgb(255, 0, 0) 0%, rgb(0, 255, 0) 100%)',
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

/**
 * Edge mask utilities
 */
for (let [classes, expected] of [
  //
  // Single values (from)
  //
  [
    'mask-x-from-20%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(to right, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-y-from-20%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(to top, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-t-from-20%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(to top, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-r-from-20%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(to right, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-b-from-20%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-l-from-20%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],

  //
  // Single values (to)
  //
  [
    'mask-x-to-80%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(to right, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-y-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-t-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-r-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(to right, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-b-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-l-to-80%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],

  //
  // Multiple values (from + to)
  //
  [
    'mask-x-from-20% mask-x-to-80%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(to right, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-y-from-20% mask-y-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(to top, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-t-from-20% mask-t-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(to top, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-r-from-20% mask-r-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(to right, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-b-from-20% mask-b-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-l-from-20% mask-l-to-80%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],

  //
  // Multiple edges
  //
  [
    'mask-t-from-10% mask-t-to-20% mask-r-from-30% mask-r-to-40% mask-b-from-50% mask-b-to-60% mask-l-from-70% mask-l-to-80%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 70%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(to right, rgb(0, 0, 0) 30%, rgba(0, 0, 0, 0) 40%)',
      'linear-gradient(rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 60%)',
      'linear-gradient(to top, rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0) 20%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-x-from-10% mask-x-to-20% mask-y-from-30% mask-y-to-40%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0) 20%)',
      'linear-gradient(to right, rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0) 20%)',
      'linear-gradient(rgb(0, 0, 0) 30%, rgba(0, 0, 0, 0) 40%)',
      'linear-gradient(to top, rgb(0, 0, 0) 30%, rgba(0, 0, 0, 0) 40%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],

  //
  // Multiple edges
  // TRBL takes precedence over XY
  //
  [
    'mask-x-from-20% mask-x-to-80% mask-l-from-30% mask-r-to-70%',
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 30%, rgba(0, 0, 0, 0) 80%)',
      'linear-gradient(to right, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 70%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-y-from-20% mask-y-to-80% mask-t-from-30% mask-b-to-70%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 70%)',
      'linear-gradient(to top, rgb(0, 0, 0) 30%, rgba(0, 0, 0, 0) 80%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
]) {
  test(`mask edges, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="${classes}">Hello world</div>`,
    )

    if (Array.isArray(expected)) {
      expect(expected).toContain(await getPropertyValue('#x', 'mask-image'))
    } else {
      expect(await getPropertyValue('#x', 'mask-image')).toEqual(expected)
    }
  })
}

/**
 * Linear mask utilities
 */
for (let [classes, expected] of [
  //
  // Single values (from, to)
  //
  [
    'mask-linear-45 mask-linear-from-20%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(45deg, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(calc(45deg), rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),
    ],
  ],
  [
    'mask-linear-45 mask-linear-to-80%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(45deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(calc(45deg), rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),
    ],
  ],

  //
  // Multiple values
  //
  [
    'mask-linear-45 mask-linear-from-20% mask-linear-to-80%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(45deg, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(calc(45deg), rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),
    ],
  ],
]) {
  test(`mask linear, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="${classes}">Hello world</div>`,
    )

    if (Array.isArray(expected)) {
      expect(expected).toContain(await getPropertyValue('#x', 'mask-image'))
    } else {
      expect(await getPropertyValue('#x', 'mask-image')).toEqual(expected)
    }
  })
}

/**
 * Radial mask utilities
 */
for (let [classes, expected] of [
  //
  // Single values (from, to)
  //
  [
    'mask-radial-from-20%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-radial-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],

  //
  // Multiple values (from, to)
  //
  [
    'mask-radial-from-20% mask-radial-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],

  //
  // Shapes
  //
  [
    'mask-circle mask-radial-from-20% mask-radial-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(circle, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],
  [
    'mask-ellipse mask-radial-from-20% mask-radial-to-80%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],

  //
  // Positions
  //
  [
    'mask-radial-at-top-left mask-radial-from-20% mask-radial-to-80%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'radial-gradient(at 0% 0%, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'radial-gradient(at left top, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),
    ],
  ],
  [
    'mask-circle mask-radial-at-top-left mask-radial-from-20% mask-radial-to-80%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'radial-gradient(circle at 0% 0%, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'radial-gradient(circle at left top, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),
    ],
  ],

  //
  // Sizes
  //
  [
    'mask-radial-[100%_100%] mask-radial-from-20%',
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(100% 100%, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ],

  //
  // Complicated radial gradient
  //
  [
    'mask-radial-[25%_150%] mask-radial-at-top mask-ellipse mask-radial-from-20% mask-radial-to-80%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'radial-gradient(25% 150% at 50% 0%, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'radial-gradient(25% 150% at center top, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
        // Conic
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      ].join(', '),
    ],
  ],
]) {
  test(`mask radial, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="${classes}">Hello world</div>`,
    )

    if (Array.isArray(expected)) {
      expect(expected).toContain(await getPropertyValue('#x', 'mask-image'))
    } else {
      expect(await getPropertyValue('#x', 'mask-image')).toEqual(expected)
    }
  })
}

/**
 * Conic mask utilities
 */
for (let [classes, expected] of [
  //
  // Single values (from, to)
  //
  [
    'mask-conic-45 mask-conic-from-20%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'conic-gradient(from 45deg, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'conic-gradient(from calc(45deg), rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      ].join(', '),
    ],
  ],
  [
    'mask-conic-45 mask-conic-to-80%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'conic-gradient(from 45deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'conic-gradient(from calc(45deg), rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%)',
      ].join(', '),
    ],
  ],

  //
  // Multiple values
  //
  [
    'mask-conic-45 mask-conic-from-20% mask-conic-to-80%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'conic-gradient(from 45deg, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Radial
        'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
        // Conic
        'conic-gradient(from calc(45deg), rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 80%)',
      ].join(', '),
    ],
  ],
]) {
  test(`mask conic, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="${classes}">Hello world</div>`,
    )

    if (Array.isArray(expected)) {
      expect(expected).toContain(await getPropertyValue('#x', 'mask-image'))
    } else {
      expect(await getPropertyValue('#x', 'mask-image')).toEqual(expected)
    }
  })
}

/**
 * Multiple masks
 */
for (let [classes, expected] of [
  //
  // Single values (from, to)
  //
  [
    'mask-conic-45 mask-conic-from-20% mask-linear-30 mask-linear-to-70% mask-circle mask-radial-from-40% mask-radial-to-80%',
    [
      // WebKit / Firefox
      [
        // Linear
        'linear-gradient(30deg, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 70%)',
        // Radial
        'radial-gradient(circle, rgb(0, 0, 0) 40%, rgba(0, 0, 0, 0) 80%)',
        // Conic
        'conic-gradient(from 45deg, rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      ].join(', '),

      // Chromium
      [
        // Linear
        'linear-gradient(calc(30deg), rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 70%)',
        // Radial
        'radial-gradient(circle, rgb(0, 0, 0) 40%, rgba(0, 0, 0, 0) 80%)',
        // Conic
        'conic-gradient(from calc(45deg), rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)',
      ].join(', '),
    ],
  ],
]) {
  test(`mask multiple, "${classes}"`, async ({ page }) => {
    let { getPropertyValue } = await render(
      page,
      html`<div id="x" class="${classes}">Hello world</div>`,
    )

    if (Array.isArray(expected)) {
      expect(expected).toContain(await getPropertyValue('#x', 'mask-image'))
    } else {
      expect(await getPropertyValue('#x', 'mask-image')).toEqual(expected)
    }
  })
}

test('mask edges can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html` <div id="x" class="mask-x-from-25% hover:mask-x-to-75%">Hello world</div> `,
  )

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(to right, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%)',
      'linear-gradient(to right, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )
})

test('mask edge colors can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="mask-x-from-25% hover:mask-x-from-transparent hover:mask-x-to-black">
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(to left, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(to right, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(to left, rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 100%)',
      'linear-gradient(to right, rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 100%)',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )
})

test('linear mask direction can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="mask-linear-15 mask-linear-from-25% hover:mask-linear-45">Hello world</div>
    `,
  )

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(15deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(calc(15deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))

  await page.locator('#x').hover()

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(45deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(calc(45deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))
})

test('linear mask position can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="mask-linear-15 mask-linear-from-25% hover:mask-linear-to-75%">
        Hello world
      </div>
    `,
  )

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(15deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(calc(15deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))

  await page.locator('#x').hover()

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(15deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(calc(15deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))
})

test('linear mask colors can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div
        id="x"
        class="mask-linear-15 mask-linear-from-25% hover:mask-linear-from-transparent hover:mask-linear-to-black"
      >
        Hello world
      </div>
    `,
  )

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(15deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(calc(15deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))

  await page.locator('#x').hover()

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(15deg, rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(calc(15deg), rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 100%)',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))
})

test('radial mask size can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="mask-radial-[50%_50%] mask-radial-from-25% hover:mask-radial-[125%_25%]">
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(50% 50%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(125% 25%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )
})

test('radial mask position can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="mask-radial-[50%_50%] mask-radial-from-25% hover:mask-radial-to-75%">
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(50% 50%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(50% 50%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )
})

test('radial mask color can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div
        id="x"
        class="mask-radial-[50%_50%] mask-radial-from-25% hover:mask-radial-from-transparent hover:mask-radial-to-black"
      >
        Hello world
      </div>
    `,
  )

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(50% 50%, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )

  await page.locator('#x').hover()

  expect(await getPropertyValue('#x', 'mask-image')).toEqual(
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'radial-gradient(50% 50%, rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 100%)',
      // Conic
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
    ].join(', '),
  )
})

test('conic mask direction can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="mask-conic-15 mask-conic-from-25% hover:mask-conic-45">Hello world</div>
    `,
  )

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from 15deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from calc(15deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))

  await page.locator('#x').hover()

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from 45deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from calc(45deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))
})

test('conic mask position can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="x" class="mask-conic-15 mask-conic-from-25% hover:mask-conic-to-75%">
        Hello world
      </div>
    `,
  )

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from 15deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from calc(15deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))

  await page.locator('#x').hover()

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from 15deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%)',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from calc(15deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%)',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))
})

test('conic mask color can be changed on hover', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div
        id="x"
        class="mask-conic-15 mask-conic-from-25% hover:mask-conic-from-transparent hover:mask-conic-to-black"
      >
        Hello world
      </div>
    `,
  )

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from 15deg, rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from calc(15deg), rgb(0, 0, 0) 25%, rgba(0, 0, 0, 0) 100%)',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))

  await page.locator('#x').hover()

  expect([
    // WebKit / Firefox
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from 15deg, rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 100%)',
    ].join(', '),

    // Chromium
    [
      // Linear
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Radial
      'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255))',
      // Conic
      'conic-gradient(from calc(15deg), rgba(0, 0, 0, 0) 25%, rgb(0, 0, 0) 100%)',
    ].join(', '),
  ]).toContain(await getPropertyValue('#x', 'mask-image'))
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
  let { getPropertyList } = await render(
    page,
    html`<div
      id="x"
      class="shadow-sm shadow-[#f00] inset-shadow-sm inset-shadow-[#0f0] ring ring-[#fff] inset-ring inset-ring-[#00f]"
    ></div>`,
  )

  expect(await getPropertyList('#x', 'box-shadow')).toEqual([
    expect.stringMatching(/oklab\(0.866\d+ -0.233\d+ 0.179\d+\) 0px 2px 4px 0px inset/), // inset-shadow
    'rgb(0, 0, 255) 0px 0px 0px 1px inset', // inset-ring
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px', // ring-offset (disabled)
    'rgb(255, 255, 255) 0px 0px 0px 1px', // ring

    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 3px 0px/), // shadow
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 2px -1px/), // shadow
  ])
})

test('shadow colors', async ({ page }) => {
  let { getPropertyList } = await render(
    page,
    html`
      <div id="a" class="shadow-sm shadow-red"></div>
      <div id="b" class="shadow-xl shadow-red"></div>
      <div id="c" class="shadow-[0px_2px_4px] shadow-red"></div>
      <div id="d" class="shadow-sm shadow-red hover:shadow-xl">Hello world</div>
      <div id="e" class="shadow-sm shadow-red hover:shadow-xl hover:shadow-initial">
        Hello world
      </div>

      <div id="f" class="shadow-xs/75">Hello world</div>
      <div id="g" class="shadow-xs/75 shadow-red/75">Hello world</div>
    `,
  )

  expect(await getPropertyList('#a', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',

    //
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 3px 0px/),
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 2px -1px/),
  ])

  expect(await getPropertyList('#b', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',

    //
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 20px 25px -5px/),
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 8px 10px -6px/),
  ])

  expect(await getPropertyList('#c', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',

    //
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 2px 4px 0px/),
  ])

  expect(await getPropertyList('#d', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',

    //
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 3px 0px/),
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 2px -1px/),
  ])

  expect(await getPropertyList('#f', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'oklab(0 0 0 / 0.75) 0px 1px 2px 0px',
  ])

  expect(await getPropertyList('#g', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+ \/ 0.56\d+\) 0px 1px 2px 0px/),
  ])

  await page.locator('#d').hover()

  expect(await getPropertyList('#d', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',

    //
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 20px 25px -5px/),
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 8px 10px -6px/),
  ])

  expect(await getPropertyList('#e', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',

    //
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 3px 0px/),
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 2px -1px/),
  ])

  await page.locator('#e').hover()

  expect(await getPropertyList('#e', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',

    //
    'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px',
    'rgba(0, 0, 0, 0.1) 0px 8px 10px -6px',
  ])
})

test('inset shadow colors', async ({ page }) => {
  let { getPropertyList } = await render(
    page,
    html`
      <div id="a" class="inset-shadow-xs inset-shadow-red"></div>
      <div id="b" class="inset-shadow-sm inset-shadow-red"></div>
      <div id="c" class="inset-shadow-[0px_3px_6px] inset-shadow-red"></div>
      <div id="d" class="inset-shadow-xs inset-shadow-red hover:inset-shadow-sm">Hello world</div>
      <div
        id="e"
        class="inset-shadow-xs inset-shadow-red hover:inset-shadow-sm hover:inset-shadow-initial"
      >
        Hello world
      </div>

      <div id="f" class="inset-shadow-xs/75">Hello world</div>
      <div id="g" class="inset-shadow-xs/75 inset-shadow-red/75">Hello world</div>
    `,
  )

  expect(await getPropertyList('#a', 'box-shadow')).toEqual([
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 1px 0px inset/),
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])
  expect(await getPropertyList('#b', 'box-shadow')).toEqual([
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 2px 4px 0px inset/),
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])
  expect(await getPropertyList('#c', 'box-shadow')).toEqual([
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 3px 6px 0px inset/),
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])

  expect(await getPropertyList('#d', 'box-shadow')).toEqual([
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 1px 0px inset/),
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])

  expect(await getPropertyList('#f', 'box-shadow')).toEqual([
    'oklab(0 0 0 / 0.75) 0px 1px 1px 0px inset',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])

  expect(await getPropertyList('#g', 'box-shadow')).toEqual([
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+ \/ 0.56\d+\) 0px 1px 1px 0px inset/),
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])

  await page.locator('#d').hover()

  expect(await getPropertyList('#d', 'box-shadow')).toEqual([
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 2px 4px 0px inset/),
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])

  expect(await getPropertyList('#e', 'box-shadow')).toEqual([
    expect.stringMatching(/oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 1px 0px inset/),
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])

  await page.locator('#e').hover()

  expect(await getPropertyList('#e', 'box-shadow')).toEqual([
    'rgba(0, 0, 0, 0.05) 0px 2px 4px 0px inset',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
    'rgba(0, 0, 0, 0) 0px 0px 0px 0px',
  ])
})

test('text shadow colors', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div id="a" class="text-shadow-xs text-shadow-red"></div>
      <div id="b" class="text-shadow-lg text-shadow-red"></div>
      <div id="c" class="text-shadow-[0px_2px_4px] text-shadow-red"></div>
      <div id="d" class="text-shadow-xs text-shadow-red hover:text-shadow-lg">Hello world</div>
      <div
        id="e"
        class="text-shadow-xs text-shadow-red hover:text-shadow-lg hover:text-shadow-initial"
      >
        Hello world
      </div>

      <div id="f" class="text-shadow-xs/75">Hello world</div>
      <div id="g" class="text-shadow-xs/75 text-shadow-red/75">Hello world</div>
    `,
  )

  expect(await getPropertyValue('#a', 'text-shadow')).toMatch(
    /oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 1px/,
  )
  expect(await getPropertyValue('#b', 'text-shadow')).toMatch(
    /oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 2px, oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 3px 2px, oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 4px 8px/,
  )
  expect(await getPropertyValue('#c', 'text-shadow')).toMatch(
    /oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 2px 4px/,
  )
  expect(await getPropertyValue('#d', 'text-shadow')).toMatch(
    /oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 1px/,
  )

  expect(await getPropertyValue('#f', 'text-shadow')).toEqual('oklab(0 0 0 / 0.75) 0px 1px 1px')
  expect(await getPropertyValue('#g', 'text-shadow')).toMatch(
    /oklab\(0.627\d+ 0.224\d+ 0.125\d+ \/ 0.56\d+\) 0px 1px 1px/,
  )

  await page.locator('#d').hover()

  expect(await getPropertyValue('#d', 'text-shadow')).toMatch(
    /oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 2px, oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 3px 2px, oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 4px 8px/,
  )

  expect(await getPropertyValue('#e', 'text-shadow')).toMatch(
    /oklab\(0.627\d+ 0.224\d+ 0.125\d+\) 0px 1px 1px/,
  )

  await page.locator('#e').hover()

  expect(await getPropertyValue('#e', 'text-shadow')).toEqual(
    'rgba(0, 0, 0, 0.1) 0px 1px 2px, rgba(0, 0, 0, 0.1) 0px 3px 2px, rgba(0, 0, 0, 0.1) 0px 4px 8px',
  )
})

test('filter', async ({ page }) => {
  let { getPropertyValue } = await render(
    page,
    html`
      <div
        id="a"
        class="blur-md brightness-50 contrast-50 drop-shadow-md grayscale hue-rotate-180 invert saturate-50 sepia"
      >
        <div id="b" class="contrast-100"></div>
      </div>
    `,
  )

  expect(await getPropertyValue('#a', 'filter')).toEqual(
    [
      'blur(12px)',
      'brightness(0.5)',
      'contrast(0.5)',
      'grayscale(1)',
      'hue-rotate(180deg)',
      'invert(1)',
      'saturate(0.5)',
      'sepia(1)',
      'drop-shadow(rgba(0, 0, 0, 0.12) 0px 3px 3px)',
    ].join(' '),
  )
  expect(await getPropertyValue('#b', 'filter')).toEqual('contrast(1)')
})

test('drop shadow colors', async ({ page }) => {
  let { getPropertyList } = await render(
    page,
    html`
      <div id="a" class="drop-shadow-md"></div>
      <div id="b" class="drop-shadow-md drop-shadow-red"></div>
      <div id="c" class="drop-shadow-md/50"></div>
      <div id="d" class="drop-shadow-md/50 drop-shadow-red"></div>
      <div id="e" class="drop-shadow-md/50 drop-shadow-red/50"></div>
    `,
  )

  expect(await getPropertyList('#a', 'filter')).toEqual([
    'drop-shadow(rgba(0, 0, 0, 0.12) 0px 3px 3px)',
  ])

  expect(await getPropertyList('#b', 'filter')).toEqual([
    expect.stringMatching(/drop-shadow\(oklab\(0\.627\d+ 0\.224\d+ 0\.125\d+\) 0px 3px 3px\)/),
  ])

  expect(await getPropertyList('#c', 'filter')).toEqual([
    'drop-shadow(oklab(0 0 0 / 0.5) 0px 3px 3px)',
  ])

  expect(await getPropertyList('#d', 'filter')).toEqual([
    expect.stringMatching(
      /drop-shadow\(oklab\(0\.627\d+ 0\.224\d+ 0\.125\d+ \/ 0\.5\) 0px 3px 3px\)/,
    ),
  ])

  expect(await getPropertyList('#e', 'filter')).toEqual([
    expect.stringMatching(
      /drop-shadow\(oklab\(0\.627\d+ 0\.224\d+ 0\.125\d+ \/ 0\.25\) 0px 3px 3px\)/,
    ),
  ])
})

test('multiple drop shadow filters with `@theme inline`', async ({ page }) => {
  let { getPropertyList } = await render(
    page,
    html`
      <div id="a" class="drop-shadow-inlined"></div>
      <div id="b" class="drop-shadow-inlined drop-shadow-red"></div>
      <div style="--drop-shadow-var: 0 20px 20px rgb(0 0 0 / 0.75)">
        <div id="c" class="drop-shadow-var"></div>
      </div>
      <div style="--drop-shadow-var: 0 10px 10px rgb(0 0 0 / 0.75), 0 20px 20px rgb(0 0 0 / 0.75)">
        <div id="d" class="drop-shadow-var"></div>
      </div>
    `,
    css`
      @theme {
        --drop-shadow-var: 0 1px 1px rgb(0 0 0 / 0.5), 0 10px 10px rgb(0 0 0 / 0.25);
      }
      @theme inline {
        --drop-shadow-inlined: 0 1px 1px rgb(0 0 0 / 0.5), 0 10px 10px rgb(0 0 0 / 0.25);
      }
    `,
  )

  expect(await getPropertyList('#a', 'filter')).toEqual([
    'drop-shadow(rgba(0, 0, 0, 0.5) 0px 1px 1px) drop-shadow(rgba(0, 0, 0, 0.25) 0px 10px 10px)',
  ])

  expect(await getPropertyList('#b', 'filter')).toEqual([
    expect.stringMatching(
      /drop-shadow\(oklab\(0\.627\d+ 0\.224\d+ 0\.125\d+\) 0px 1px 1px\) drop-shadow\(oklab\(0\.627\d+ 0\.224\d+ 0\.125\d+\) 0px 10px 10px\)/,
    ),
  ])

  expect(await getPropertyList('#c', 'filter')).toEqual([
    'drop-shadow(rgba(0, 0, 0, 0.75) 0px 20px 20px)',
  ])

  // Multiple values are only supported with `@theme inline` because otherwise we use var(…)
  // inside of drop-shadow(…) which can only ever be a single shadow
  expect(await getPropertyList('#d', 'filter')).toEqual(['none'])
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
        --text-sm: 14px;
        --text-sm--line-height: 16px;
        --text-xl: 20px;
        --text-xl--line-height: 24px;
        --leading-tight: 8px;
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
        --text-sm: 14px;
        --text-sm--line-height: 16px;
        --text-xl: 20px;
        --text-xl--line-height: 24px;
        --leading-tight: 8px;
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
        --text-sm--letter-spacing: 5px;
        --text-xl--letter-spacing: 10px;
        --tracking-tight: 1px;
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
        --text-sm--font-weight: 100;
        --text-xl--font-weight: 200;
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

test('shadow DOM has access to variables', async ({ page }) => {
  await render(
    page,
    html`
      <script type="text/javascript">
        class Component extends HTMLElement {
          constructor() {
            super()
            this.attachShadow({ mode: 'open' })
          }

          connectedCallback() {
            this.shadowRoot.innerHTML =
              '<style>' +
              document.querySelector('style').textContent +
              '</style>' +
              '<div class="flex gap-2" id="x">' +
              '  <div>one</div>' +
              '  <div>two</div>' +
              '</div>'
          }
        }

        customElements.define('my-component', Component)
      </script>

      <my-component id="shadow"></my-component>
    `,
  )

  let gap = await page.evaluate(() => {
    let shadowRoot = document.querySelector('#shadow')!.shadowRoot!
    let x = shadowRoot.querySelector('#x')!
    return window.getComputedStyle(x).getPropertyValue('gap')
  })

  expect(gap).toBe('8px')
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
        --color-black: black;
        --color-transparent: transparent;
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

  let scanner = new Scanner({})
  let candidates = scanner.scanFiles([{ content, extension: 'html' }])

  let styles = optimize(build(candidates))

  content = `<style type="text/css">${styles}</style>${content}`
  await page.setContent(content)

  await page.locator('#mouse-park').hover()

  return {
    getPropertyValue(selector: string | [string, string], property: string) {
      return getPropertyValue(
        page,
        Array.isArray(selector) ? selector : [selector, undefined],
        property,
      )
    },

    async getPropertyList(selector: string | [string, string], property: string) {
      let value = await getPropertyValue(
        page,
        Array.isArray(selector) ? selector : [selector, undefined],
        property,
      )

      return segment(value, ',').map((item) => item.trim())
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
