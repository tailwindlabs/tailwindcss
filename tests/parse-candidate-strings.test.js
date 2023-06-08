import { parseCandidateStrings, IO, Parsing } from '@tailwindcss/oxide'
import { defaultExtractor as createDefaultExtractor } from '../src/lib/defaultExtractor'

let html = String.raw

let defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

function regexParser(str) {
  return defaultExtractor(str)
}

function oxideParser(str) {
  return parseCandidateStrings(
    [{ content: str, extension: 'html' }],
    IO.Sequential | Parsing.Parallel
  )
}

function templateTable(classes) {
  classes = classes.concat(
    // Variants
    classes.flatMap((c) => {
      return [
        // Simple variant
        `hover:${c}`,

        // Combined variant
        `focus:hover:${c}`,

        // Variant with dashes
        `group-hover:group-focus:${c}`,

        // With special characters
        `<sm:${c}`,
        `md>:${c}`,

        // With arbitrary values
        `min-[300px]:${c}`,

        // With arbitrary values
        `[@media(hover:hover)]:${c}`,

        // With parent selector
        `[.foo_&]:${c}`,
      ]
    })
  )

  let classString = classes.join(' ')
  let singleQuoteArraySyntaxWithSpace = `'${classes.join("', '")}'`
  let singleQuoteArraySyntaxWithoutSpace = `'${classes.join("','")}'`

  return [
    ['Plain', classString],
    ['HTML', html`<div class="${classString}"></div>`],

    ['JavaScript variable', `let foo = "${classString}"`],
    ['JavaScript expression', `document.body.classList.add(['${classString}'].join(' '))`],
    ['JavaScript object key', `let foo = {'${classString}': true}`],

    ['JSX basic', html`<div className="${classString}"></div>`],
    ['JSX with JavaScript expression', html`<div className={"${classString}"}></div>`],

    ['Vue basic', html`<div :class="${classString}"></div>`],
    [
      'Vue array (single quote, with space)',
      html`<div :class="[${singleQuoteArraySyntaxWithSpace}]"></div>`,
    ],
    [
      'Vue array (single quote, without space)',
      html`<div :class="[${singleQuoteArraySyntaxWithoutSpace}]"></div>`,
    ],
    ['Vue object (single quote)', html`<div :class="{'${classString}': true}"></div>`],

    ['Markdown code fences', `<!-- This should work \`${classString}\` -->`],
  ].map(([name, template]) => [name, template, classes])
}

describe.each([
  ['Regex', regexParser],
  ['Oxide', oxideParser],
])('%s parser', (_, parse) => {
  describe('basic utility classes', () => {
    let classes = [
      // One word classes
      'underline',

      // With dashes
      'text-center',
      'pointer-events-none',

      // With numbers
      'px-4',

      // With special characters
      'px-1.5',
      'translate-x-1/2',
      'from-50%',

      // With negative signs
      '-translate-x-full',

      // With halves and negative signs
      '-translate-x-1/2',
    ]

    test.each(templateTable(classes))('%# — %s', (_, template, classes) => {
      let extractions = parse(template)

      for (let c of classes) {
        expect(extractions).toContain(c)
      }
    })
  })

  describe('utility classes with arbitrary values', () => {
    let classes = [
      // With simple number
      'px-[0]',
      'px-[0.5]',

      // With number and unit
      'px-[123px]',
      'px-[123.45px]',

      // With special symbols
      'bg-[#bada55]',
      //   ^
      'bg-[color:#bada55]',
      //        ^^
      'content-[>]',
      //        ^
      'content-[<]',
      //        ^

      // With functions and math expressions
      'px-[calc(100%-1rem)]',
      'px-[theme(spacing.1)]',
      'px-[theme(spacing[1.5])]',

      // With spaces (replaced by `_`)
      'bg-[rgb(255_0_0)]',

      // Examples with combinations
      'w-[calc(100%_-_theme("spacing[1.5]))"]',
      'fill-[oklab(59.69%_0.1007_0.1191_/_0.5)]/[33.7%]',
      'fill-[color:oklab(59.69%_0.1007_0.1191_/_0.5)]/[33.7%]',
      'shadow-[inset_0_-3em_3em_rgba(0,_0,_0,_0.1),_0_0_0_2px_rgb(255,_255,_255),_0.3em_0.3em_1em_rgba(0,_0,_0,_0.3)]',
    ]

    test.each(templateTable(classes))('%# — %s', (_, template, classes) => {
      let extractions = parse(template)

      for (let c of classes) {
        // TODO: This is a bug in the RegEx parser.
        if (!extractions.includes(c) && parse === regexParser) {
          continue
        }

        expect(extractions).toContain(c)
      }
    })
  })

  describe('utility classes with modifiers', () => {
    let classes = [
      // With simple modifiers
      'bg-red-500/50',

      // With arbitrary modifiers
      'bg-red-500/[0.5]',
      'bg-red-500/[50%]',
      'bg-red-500/[var(--opacity)]',

      // With spces (replaced by `_`)
      'bg-red-500/[var(--opacity,_50%)]',
    ]

    test.each(templateTable(classes))('%# — %s', (_, template, classes) => {
      let extractions = parse(template)

      for (let c of classes) {
        expect(extractions).toContain(c)
      }
    })
  })

  describe('utility classes with important modifier', () => {
    let classes = ['!bg-red-500', '!bg-[#bada55]', '![display:flex]', '!-translate-x-1/2']

    test.each(templateTable(classes))('%# — %s', (_, template, classes) => {
      let extractions = parse(template)

      for (let c of classes) {
        // TODO: This is a bug in the RegEx parser.
        if (!extractions.includes(c) && parse === regexParser) {
          continue
        }

        expect(extractions).toContain(c)
      }
    })
  })

  describe('arbitrary properties', () => {
    let classes = [
      // With simple arbitrary property
      '[display:flex]',
    ]

    test.each(templateTable(classes))('%# — %s', (_, template, classes) => {
      let extractions = parse(template)

      for (let c of classes) {
        expect(extractions).toContain(c)
      }
    })
  })

  describe('arbitrary values with quotes', () => {
    test('arbitrary values with single quotes', async () => {
      let extractions = parse(`
      <div class="content-['hello_world'] hover:content-['hello_world_2'] hover:focus:content-['hello_world_3']"></div>
    `)

      expect(extractions).toContain(`content-['hello_world']`)
      expect(extractions).toContain(`hover:content-['hello_world_2']`)
      expect(extractions).toContain(`hover:focus:content-['hello_world_3']`)
    })

    test('arbitrary values with double quotes', async () => {
      let extractions = parse(`
      <div class='content-["hello_world"] hover:content-["hello_world_2"] hover:focus:content-["hello_world_3"]'></div>
    `)

      expect(extractions).toContain(`content-["hello_world"]`)
      expect(extractions).toContain(`hover:content-["hello_world_2"]`)
      expect(extractions).toContain(`hover:focus:content-["hello_world_3"]`)
    })

    test('arbitrary values with some single quoted values', async () => {
      let extractions = parse(`
      <div class="font-['Open_Sans',_system-ui,_sans-serif] hover:font-['Proxima_Nova',_system-ui,_sans-serif] hover:focus:font-['Inter_var',_system-ui,_sans-serif]"></div>
    `)

      expect(extractions).toContain(`font-['Open_Sans',_system-ui,_sans-serif]`)
      expect(extractions).toContain(`hover:font-['Proxima_Nova',_system-ui,_sans-serif]`)
      expect(extractions).toContain(`hover:focus:font-['Inter_var',_system-ui,_sans-serif]`)
    })

    test('arbitrary values with some double quoted values', async () => {
      let extractions = parse(`
      <div class='font-["Open_Sans",_system-ui,_sans-serif] hover:font-["Proxima_Nova",_system-ui,_sans-serif] hover:focus:font-["Inter_var",_system-ui,_sans-serif]'></div>
    `)

      expect(extractions).toContain(`font-["Open_Sans",_system-ui,_sans-serif]`)
      expect(extractions).toContain(`hover:font-["Proxima_Nova",_system-ui,_sans-serif]`)
      expect(extractions).toContain(`hover:focus:font-["Inter_var",_system-ui,_sans-serif]`)
    })

    test('arbitrary values with escaped underscores', async () => {
      let extractions = parse(`
      <div class="content-['hello\\_world'] hover:content-['hello\\_world\\_2'] hover:focus:content-['hello\\_world\\_3']"></div>
    `)

      expect(extractions).toContain(`content-['hello\\_world']`)
      expect(extractions).toContain(`hover:content-['hello\\_world\\_2']`)
      expect(extractions).toContain(`hover:focus:content-['hello\\_world\\_3']`)
    })

    test('arbitrary values with angle brackets in single quotes', async () => {
      let extractions = parse(`
      <div class="content-['>'] hover:content-['<'] hover:focus:content-['>']"></div>
    `)

      expect(extractions).toContain(`content-['>']`)
      expect(extractions).toContain(`hover:content-['<']`)
      expect(extractions).toContain(`hover:focus:content-['>']`)
    })

    test('arbitrary values with angle brackets in double quotes', async () => {
      let extractions = parse(`
      <div class="content-[">"] hover:content-["<"] hover:focus:content-[">"]"></div>
    `)

      expect(extractions).toContain(`content-[">"]`)
      expect(extractions).toContain(`hover:content-["<"]`)
      expect(extractions).toContain(`hover:focus:content-[">"]`)
    })

    test('arbitrary values with theme lookup using quotes', () => {
      let extractions = parse(`
      <p class="[--y:theme('colors.blue.500')] [color:var(--y)]"></p>
    `)

      expect(extractions).toContain(`[--y:theme('colors.blue.500')]`)
      expect(extractions).toContain(`[color:var(--y)]`)
    })
  })

  test('special characters', async () => {
    let extractions = parse(`
      <div class="<sm:underline md>:font-bold"></div>
    `)

    expect(extractions).toContain(`<sm:underline`)
    expect(extractions).toContain(`md>:font-bold`)
  })

  test('with single quotes array within template literal', async () => {
    let extractions = parse(`<div class=\`\${['pr-1.5']}\`></div>`)

    expect(extractions).toContain('pr-1.5')
  })

  test('with double quotes array within template literal', async () => {
    let extractions = parse(`<div class=\`\${["pr-1.5"]}\`></div>`)

    expect(extractions).toContain('pr-1.5')
  })

  test('with single quotes array within function', async () => {
    let extractions = parse(`document.body.classList.add(['pl-1.5'].join(" "));`)

    expect(extractions).toContain('pl-1.5')
  })

  test('with double quotes array within function', async () => {
    let extractions = parse(`document.body.classList.add(["pl-1.5"].join(" "));`)

    expect(extractions).toContain('pl-1.5')
  })

  test('with angle brackets', async () => {
    let extractions = parse(
      `<div class="bg-blue-200 <% if (useShadow) { %>shadow-xl<% } %>">test</div>`
    )

    expect(extractions).toContain('bg-blue-200')
    expect(extractions).toContain('shadow-xl')
    expect(extractions).not.toContain('>shadow-xl')
    expect(extractions).not.toContain('shadow-xl<')
  })

  test('markdown code fences', async () => {
    let extractions = parse('<!-- this should work: `.font-bold`, `.font-normal` -->')

    expect(extractions).toContain('font-bold')
    expect(extractions).toContain('font-normal')
    expect(extractions).not.toContain('.font-bold')
    expect(extractions).not.toContain('.font-normal')
  })

  test('classes in slim templates', async () => {
    let extractions = parse(`
      p.bg-red-500.text-sm
        'This is a paragraph
          small.italic.text-gray-500
            '(Look mom, no closing tag!)
    `)

    expect(extractions).toContain('bg-red-500')
    expect(extractions).toContain('text-sm')
    expect(extractions).toContain('italic')
    expect(extractions).toContain('text-gray-500')
  })

  test('multi-word + arbitrary values + quotes', async () => {
    let extractions = parse(`
      grid-cols-['repeat(2)']
    `)

    expect(extractions).toContain(`grid-cols-['repeat(2)']`)
  })

  test('a lot of data', () => {
    let extractions = parse('underline '.repeat(2 ** 17))

    expect(extractions).toContain(`underline`)
  })

  test('ruby percent string array', () => {
    let extractions = parse('%w[text-[#bada55]]')

    expect(extractions).toContain(`text-[#bada55]`)
  })

  test('arbitrary properties followed by square bracketed stuff', () => {
    let extractions = parse(
      '<div class="h-16 items-end border border-white [display:inherit]">[foo]</div>'
    )

    expect(extractions).toContain(`[display:inherit]`)
  })

  describe('Vue', () => {
    test('Class object syntax', () => {
      let extractions = parse(
        `<Examples with combinations :class="{ underline: myCondition, 'font-bold': myCondition }">[foo]</div>`
      )

      expect(extractions).toContain(`underline`, `font-bold`)
    })

    test('Class array syntax', () => {
      // With leading space
      let extractions = parse(
        `<div :class="[ 'underline', myCondition && 'font-bold', myCondition ? 'flex' : 'block' ]">[foo]</div>`
      )

      expect(extractions).toContain(`underline`, `font-bold`, `flex`, `block`)

      // Without leading space
      extractions = parse(
        `<div :class="['underline', myCondition && 'font-bold', myCondition ? 'flex' : 'block']">[foo]</div>`
      )

      expect(extractions).toContain(`underline`, `font-bold`, `flex`, `block`)
    })
  })

  describe('anti-test', () => {
    it('should not parse candidates without spaces in object-like syntax', () => {
      let extractions = parse(html`<div class="{underline:isActive,flex:isOnline,md:bold}"></div>`)

      // The oxide parser _does_ allow this!
      if (parse !== oxideParser) {
        expect(extractions).not.toContain(`underline:isActive`)
        expect(extractions).not.toContain(`flex:isOnline`)
        expect(extractions).not.toContain(`md:bold`)
      }

      expect(extractions).not.toContain(`underline`)
      expect(extractions).not.toContain(`isActive`)
      expect(extractions).not.toContain(`flex`)
      expect(extractions).not.toContain(`isOnline`)
      expect(extractions).not.toContain(`md`)
      expect(extractions).not.toContain(`bold`)
    })
  })
})
