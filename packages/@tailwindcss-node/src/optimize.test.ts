import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { optimize } from './optimize'

const css = String.raw

let originalNodeEnv = process.env.NODE_ENV

beforeEach(() => {
  // The warning output is suppressed in tests, so temporarily switch to a
  // non-test environment to be able to observe it.
  process.env.NODE_ENV = 'production'
})

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv
  vi.restoreAllMocks()
})

test('does not warn about `::ng-deep`, Angular’s deep-selector combinator', () => {
  let warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

  optimize(css`
    :host {
      ::ng-deep .foo {
        color: red;
      }
    }
  `)

  expect(warn).not.toHaveBeenCalled()
})

test('does not warn about `:deep()`, `:slotted()`, or `:global()`', () => {
  let warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

  optimize(css`
    :host {
      :deep(.foo) {
        color: red;
      }
      :slotted(.bar) {
        color: red;
      }
    }
    :global(.baz) {
      color: red;
    }
  `)

  expect(warn).not.toHaveBeenCalled()
})

test('still warns about genuinely unknown pseudo-elements', () => {
  let warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

  optimize(css`
    .foo::totally-bogus-pseudo {
      color: red;
    }
  `)

  expect(warn).toHaveBeenCalled()
})
