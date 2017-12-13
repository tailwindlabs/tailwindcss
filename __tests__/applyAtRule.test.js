import postcss from 'postcss'
import plugin from '../src/lib/substituteClassApplyAtRules'

function run(input, opts = () => {}) {
  return postcss([plugin(opts)]).process(input)
}

test("it copies a class's declarations into itself", () => {
  const output = '.a { color: red; } .b { color: red; }'

  return run('.a { color: red; } .b { @apply .a; }').then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
})

test('it removes important from applied classes by default', () => {
  const input = `
    .a { color: red !important; }
    .b { @apply .a; }
  `

  const expected = `
    .a { color: red !important; }
    .b { color: red; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('applied rules can be made !important', () => {
  const input = `
    .a { color: red; }
    .b { @apply .a !important; }
  `

  const expected = `
    .a { color: red; }
    .b { color: red !important; }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('cssnext custom property sets are preserved', () => {
  const input = `
    .a {
      color: red;
    }
    .b {
      @apply .a --custom-property-set;
    }
  `

  const expected = `
    .a {
      color: red;
    }
    .b {
      color: red;
      @apply --custom-property-set;
    }
  `

  return run(input).then(result => {
    expect(result.css).toEqual(expected)
    expect(result.warnings().length).toBe(0)
  })
})

test('it fails if the class does not exist', () => {
  return run('.b { @apply .a; }').catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('applying classes that are ever used in a media query is not supported', () => {
  const input = `
    .a {
      color: red;
    }

    @media (min-width: 300px) {
      .a { color: blue; }
    }

    .b {
      @apply .a;
    }
  `
  expect.assertions(1)
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('it does not match classes that include pseudo-selectors', () => {
  const input = `
    .a:hover {
      color: red;
    }

    .b {
      @apply .a;
    }
  `
  expect.assertions(1)
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})

test('it does not match classes that have multiple rules', () => {
  const input = `
    .a {
      color: red;
    }

    .b {
      @apply .a;
    }

    .a {
      color: blue;
    }
  `
  expect.assertions(1)
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' })
  })
})
