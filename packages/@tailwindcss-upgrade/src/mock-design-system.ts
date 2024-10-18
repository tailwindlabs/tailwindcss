import {
  parseCandidate,
  parseVariant,
  type Candidate,
  type Variant,
} from '../../tailwindcss/src/candidate'
import type { DesignSystem } from '../../tailwindcss/src/design-system'
import { convertUnderscoresToWhitespace } from '../../tailwindcss/src/utils/decode-arbitrary-value'
import * as ValueParser from '../../tailwindcss/src/value-parser'

export function mockDesignSystem(designSystem: DesignSystem): DesignSystem {
  // Custom `parseCandidate` implementation that does two things:
  // 1. Has custom `decodeArbitraryValue` that does not add whitespace around
  //    operators.
  // 2. Does not cache the parsing of candidates
  designSystem.parseCandidate = (candidate) => {
    return Array.from(parseCandidate(candidate, designSystem, { decodeArbitraryValue })).map(
      (candidate) => {
        // We inject `&:is(…)` into arbitrary variants `[p]` becomes `[&:is(p)]`.
        //
        // In this case, for the migrations we don't care about this outer
        // `&:is(…)` so we replace it with the contents of the `&:is(…)` instead.
        //
        // We could have a false positive here _if_ the user added the `&:is()`
        // themselves. But if it's not there then we would inject it so the
        // behavior should be the exact same.
        for (let variant of variants(candidate)) {
          if (variant.kind === 'arbitrary') {
            let ast = ValueParser.parse(variant.selector)

            // &:is(…)
            if (
              ast.length === 3 &&
              // &
              ast[0].kind === 'word' &&
              ast[0].value === '&' &&
              // :
              ast[1].kind === 'separator' &&
              ast[1].value === ':' &&
              // is(…)
              ast[2].kind === 'function' &&
              ast[2].value === 'is'
            ) {
              variant.selector = ValueParser.toCss(ast[2].nodes)
            }
          }
        }

        return candidate
      },
    )
  }

  designSystem.parseVariant = (variant) => {
    return parseVariant(variant, designSystem, { decodeArbitraryValue })
  }

  return designSystem
}

function decodeArbitraryValue(input: string) {
  // We do not want to normalize anything inside of a url() because if we
  // replace `_` with ` `, then it will very likely break the url.
  if (input.startsWith('url(')) {
    return input
  }

  input = convertUnderscoresToWhitespace(input)

  return input
}

function* variants(candidate: Candidate) {
  function* inner(variant: Variant): Iterable<Variant> {
    yield variant
    if (variant.kind === 'compound') {
      yield* inner(variant.variant)
    }
  }

  for (let variant of candidate.variants) {
    yield* inner(variant)
  }
}
