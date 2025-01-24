import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const html = String.raw

let server: Awaited<ReturnType<typeof createServer>>

test.beforeAll(async ({}, info) => {
  server = await createServer()
})

test('basic', async ({ page }) => {
  await server.render({
    page,
    body: html`<div data-test class="w-32 h-32 bg-red"></div>`,
  })

  await expect(page.locator('[data-test]')).toHaveCSS('background-color', 'rgb(255, 0, 0)')
})

test('observer', async ({ page }) => {
  await server.render({
    page,
    body: html`<div data-test class="w-32 h-32 bg-red"></div>`,
  })

  await page.evaluate(() => {
    document.querySelector('[data-test]')!.classList.replace('bg-red', 'bg-blue')
  })

  await expect(page.locator('[data-test]')).toHaveCSS('background-color', 'rgb(0, 0, 255)')
})

test('custom css', async ({ page }) => {
  await server.render({
    page,
    head: html`
      <style data-css type="text/tailwindcss">
        .foo {
          @apply bg-red;
        }
      </style>
    `,
    body: html`<div data-test class="w-32 h-32 foo"></div>`,
  })

  await expect(page.locator('[data-test]')).toHaveCSS('background-color', 'rgb(255, 0, 0)')

  await page.evaluate(() => {
    document.querySelector('[data-css]')!.textContent = `
      .foo {
        @apply bg-blue;
      }
    `
  })

  await expect(page.locator('[data-test]')).toHaveCSS('background-color', 'rgb(0, 0, 255)')
})

test('changes to `@theme`', async ({ page }) => {
  await server.render({
    page,
    head: html`
      <style data-css type="text/tailwindcss">
        @theme {
          --color-primary: #ff0000;
        }
      </style>
    `,
    body: html`<div data-test class="w-32 h-32 bg-primary"></div>`,
  })

  await expect(page.locator('[data-test]')).toHaveCSS('background-color', 'rgb(255, 0, 0)')

  await page.evaluate(() => {
    document.querySelector('[data-css]')!.textContent = `
      @theme {
        --color-primary: #0000ff;
      }
    `
  })

  await expect(page.locator('[data-test]')).toHaveCSS('background-color', 'rgb(0, 0, 255)')
})

test('no classes', async ({ page }) => {
  await server.render({
    page,
    body: html`<div data-test>test</div>`,
  })

  await expect(page.locator('body')).toHaveCSS('margin', '0px')
})

test('html classes', async ({ page }) => {
  await server.render({
    page,
    htmlClasses: 'h-4',
  })

  await expect(page.locator('html')).toHaveCSS('height', '16px')
})

async function createServer() {
  const { createApp, createRouter, defineEventHandler, toNodeListener } = await import('h3')
  const { listen } = await import('listhen')

  interface PageOptions {
    page: Page
    head?: string
    body?: string
    htmlClasses?: string
  }

  async function render({ page, htmlClasses, head, body }: PageOptions) {
    let content = html`
      <!doctype html>
      <html lang="en" class="${htmlClasses ?? ''}">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <script src="/tailwindcss.js"></script>
          <style type="text/tailwindcss">
            @theme {
              --color-red: #ff0000;
              --color-green: #00ff00;
              --color-blue: #0000ff;
            }
          </style>
          ${head ?? ''}
        </head>
        <body>
          ${body ?? ''}
        </body>
      </html>
    `

    router.get(
      '/',
      defineEventHandler(() => content),
    )

    await page.goto(server.url)
  }

  const app = createApp()
  const router = createRouter()

  router.get(
    '/tailwindcss.js',
    defineEventHandler(() => readFile(require.resolve('@tailwindcss/browser'))),
  )

  app.use(router)

  let workerIndex = Number(process.env.TEST_WORKER_INDEX ?? 0)

  let listener = await listen(toNodeListener(app), {
    port: 3000 + workerIndex,
    showURL: false,
    open: false,
  })

  return {
    app,
    url: listener.url,
    render,
  }
}
