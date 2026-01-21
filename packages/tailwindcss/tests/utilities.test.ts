test('generates utilities for escaped theme keys', async () => {
  let css = await run(
    '@tailwind utilities;',
    {
      theme: {
        colors: {
          'brand\\:primary': '#ff0000',
        },
      },
      content: [
        {
          raw: '<div class="bg-brand\\:primary"></div>',
        },
      ],
    }
  )

  expect(css).toContain('.bg-brand\\:primary')
  expect(css).toContain('background-color: #ff0000')
})
