import generateModules from '../src/util/generateModules'
import defineClasses from '../src/util/defineClasses'

function textAlign() {
  return defineClasses({
    'text-left': { 'text-align': 'left' },
    'text-right': { 'text-align': 'right' },
    'text-center': { 'text-align': 'center' },
  })
}

function display() {
  return defineClasses({
    block: { display: 'block' },
    inline: { display: 'inline' },
    'inline-block': { display: 'inline-block' },
  })
}

function borderStyle() {
  return defineClasses({
    'border-solid': { 'border-style': 'solid' },
    'border-dashed': { 'border-style': 'dashed' },
    'border-dotted': { 'border-style': 'dotted' },
  })
}

test('an empty variants list generates a @variants at-rule with no parameters', () => {
  const result = generateModules([{ name: 'textAlign', generator: textAlign }], {
    textAlign: [],
  })

  const expected = `
    @variants {
      .text-left { text-align: left }
      .text-right { text-align: right }
      .text-center { text-align: center }
    }
  `
  expect(result.toString()).toMatchCss(expected)
})

test('a `false` variants list generates no output', () => {
  const result = generateModules([{ name: 'textAlign', generator: textAlign }], {
    textAlign: false,
  })

  expect(result.toString()).toMatchCss('')
})

test('specified variants are included in the @variants at-rule', () => {
  const result = generateModules([{ name: 'textAlign', generator: textAlign }], {
    textAlign: ['responsive', 'hover'],
  })

  const expected = `
    @variants responsive, hover {
      .text-left { text-align: left }
      .text-right { text-align: right }
      .text-center { text-align: center }
    }
  `
  expect(result.toString()).toMatchCss(expected)
})

test('options must provide variants for every module', () => {
  expect(() => {
    generateModules(
      [{ name: 'textAlign', generator: textAlign }, { name: 'display', generator: display }],
      {
        textAlign: [],
      }
    )
  }).toThrow()
})

test('variants can be different for each module', () => {
  const result = generateModules(
    [
      { name: 'textAlign', generator: textAlign },
      { name: 'display', generator: display },
      { name: 'borderStyle', generator: borderStyle },
    ],
    {
      textAlign: [],
      display: false,
      borderStyle: ['responsive', 'hover', 'focus'],
    }
  )

  const expected = `
    @variants {
      .text-left { text-align: left }
      .text-right { text-align: right }
      .text-center { text-align: center }
    }

    @variants responsive, hover, focus {
      .border-solid { border-style: solid }
      .border-dashed { border-style: dashed }
      .border-dotted { border-style: dotted }
    }
  `
  expect(result.toString()).toMatchCss(expected)
})

test('generators can reference the generatorOptions object', () => {
  const result = generateModules(
    [
      {
        name: 'parameterized',
        generator: generatorParams => {
          return defineClasses({
            foo: { color: generatorParams.color },
          })
        },
      },
    ],
    {
      parameterized: [],
    },
    {
      color: 'blue',
    }
  )

  const expected = `
    @variants {
      .foo { color: blue }
    }
  `
  expect(result.toString()).toMatchCss(expected)
})
