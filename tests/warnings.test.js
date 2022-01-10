import { html, run, css } from './util/run'

let warn

beforeEach(() => {
  let log = require('../src/util/log')
  warn = jest.spyOn(log.default, 'warn')
})

afterEach(() => {
  warn.mockClear()
})

test('it warns when there is no content key', async () => {
  let config = {
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind base;
  `

  await run(input, config)

  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn.mock.calls.map((x) => x[0])).toEqual(['no-content-found'])
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

  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn.mock.calls.map((x) => x[0])).toEqual(['no-content-found'])
})
