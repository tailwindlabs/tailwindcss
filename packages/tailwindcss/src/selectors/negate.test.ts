import { expect, test } from 'vitest'
import { comment, toCss, walkDepth } from '../ast'
import { parse } from '../css-parser'
import { negateRules } from './negate'

const css = String.raw

function negate(input: string) {
  let ast = parse(input)
  let negated = negateRules(ast)

  walkDepth(negated, (node) => {
    if (node.kind !== 'rule') return
    if (node.nodes.length > 0) return

    node.nodes.push(comment(' … '))
  })

  return negated
}

test('Negation of a simple style rules', () => {
  let ast = negate(css`
    &:hover,
    &:focus {
    }
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    "&:not(*:hover, *:focus) {
      /* … */
    }
    "
  `)
})

test('Negation of simple nested style rules', () => {
  let ast = negate(css`
    &:hover {
      &:focus {
      }
    }
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    "&:not(*:hover:focus) {
      /* … */
    }
    "
  `)
})

test('Negation of nested style rules containing multiple selectors', () => {
  let ast = negate(css`
    &:hover,
    &:focus {
      &:visited,
      &:active {
      }
    }
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    "&:not(:is(*:hover, *:focus):visited, :is(*:hover, *:focus):active) {
      /* … */
    }
    "
  `)
})

test('Negation of complex nested style rules', () => {
  let ast = negate(css`
    &:hover {
      &:focus {
        &:active {
        }

        &[data-whatever] {
        }
      }

      &[data-foo] {
      }
    }

    &:visited {
    }
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    "&:not(*:hover:focus:active):not(*:hover:focus[data-whatever]):not(*:hover[data-foo]):not(*:visited) {
      /* … */
    }
    "
  `)
})

test('Negation of simple media queries', () => {
  let ast = negate(css`
    @media (min-width: 500px) {
    }
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    "@media not (min-width: 500px) {
      /* … */
    }
    "
  `)
})

test('Negation of nested at rules', () => {
  let ast = negate(css`
    @media (min-width: 500px) {
      @media (orientation: portrait) {
      }
    }
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    "@media not (orientation: portrait) {
      /* … */
    }
    @media not (min-width: 500px) {
      /* … */
    }
    "
  `)
})

test('Negation of at rules wrapping selectors', () => {
  let ast = negate(css`
    @media (hover: hover) {
      &:hover {
      }
    }
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    "&:not(*:hover) {
      /* … */
    }
    @media not (hover: hover) {
      /* … */
    }
    "
  `)
})

test('Negation of complex graphs mixing at rules and style rules', () => {
  let ast = negate(css`
    @media (min-width: 500px) {
      &:hover:focus,
      &:visited {
        @container sidebar (width < 500px) {
          &:active {
          }
        }
      }
    }
    @media (orientation: landscape) {
    }
  `)

  expect(toCss(ast)).toMatchInlineSnapshot(`
    "@media not (orientation: landscape) {
      &:not(:is(*:hover:focus,  *:visited):active) {
        /* … */
      }
    }
    @container sidebar not (width < 500px) {
      @media not (orientation: landscape) {
        /* … */
      }
    }
    @media not (min-width: 500px) {
      @media not (orientation: landscape) {
        /* … */
      }
    }
    "
  `)
})

test('Negation of at-rules that cant be', () => {
  expect(() =>
    negate(css`
      @media (min-width: 500px) {
        @layer components {
        }
      }
    `),
  ).toThrowErrorMatchingInlineSnapshot(`[Error: Unable to negate rule: @layer components]`)
})
