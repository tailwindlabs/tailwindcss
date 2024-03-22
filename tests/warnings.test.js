import { run, html, css } from './util/run'

test('it warns when there is no content key', async () => {
  let config = {
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
  `

  await run(input, config)

  expect().toHaveBeenWarnedWith(['content-problems'])
})

test('it warns when there is an empty content key', async () => {
  let config = {
    content: [],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
  `

  await run(input, config)

  expect().toHaveBeenWarnedWith(['content-problems'])
})

test('it warns when there are no utilities generated', async () => {
  let config = {
    content: [{ raw: html`nothing here matching a utility` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  await run(input, config)

  expect().toHaveBeenWarnedWith(['content-problems'])
})

it('warnings are not thrown when only variant utilities are generated', async () => {
  let config = {
    content: [{ raw: html`<div class="sm:underline"></div>` }],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  await run(input, config)

  expect().not.toHaveBeenWarned()
})
