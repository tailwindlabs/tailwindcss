import { expect, test } from 'vitest'
import { and, lit, not, or, visit } from './expr'
import { flatten, toDNF } from './rewriting'

test('De Morgan: !(A || B)', () => {
  let expr = toDNF(not(or([lit(1), lit(2)])))
  expr = visit(expr, { Exit: flatten })
  expect(expr).toEqual(and([not(lit(1)), not(lit(2))]))
})

test('De Morgan: !(A && B)', () => {
  let expr = toDNF(not(and([lit(1), lit(2)])))
  expr = visit(expr, { Exit: flatten })
  expect(expr).toEqual(or([not(lit(1)), not(lit(2))]))
})

test('Disjunctive Normal Form', () => {
  // (A || B) && (C || D) && (E || F)
  let expr = and([
    //
    or([lit(1), lit(2)]),
    or([lit(3), lit(4)]),
    or([lit(5), lit(6)]),
  ])

  expr = toDNF(expr)

  expect(expr).toEqual(
    // A && C && E ||
    // A && C && F ||
    // A && D && E ||
    // A && D && F ||
    // B && C && E ||
    // B && C && F ||
    // B && D && E ||
    // B && D && F
    or([
      //
      and([lit(1), lit(3), lit(5)]),
      and([lit(1), lit(3), lit(6)]),

      and([lit(1), lit(4), lit(5)]),
      and([lit(1), lit(4), lit(6)]),

      and([lit(2), lit(3), lit(5)]),
      and([lit(2), lit(3), lit(6)]),

      and([lit(2), lit(4), lit(5)]),
      and([lit(2), lit(4), lit(6)]),
    ]),
  )
})
