import { parseCandidateStrings, IO, Parsing } from '@tailwindcss/oxide'
import { defaultExtractor as createDefaultExtractor } from '../src/lib/defaultExtractor'

let defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

function regexParser(str) {
  return defaultExtractor(str)
}

function oxideParser(str) {
  return parseCandidateStrings(
    [{ content: str, extension: 'html' }],
    IO.Sequential | Parsing.Sequential
  )
}

let classExamples = [
  'underline',
  'font-bold',
  'z-0',
  '-z-0',
  'px-1.5',
  '-px-1.5',
  'translate-x-1/2',
  '-translate-x-1/2',
  'content-["hello"]',
  "content-['hello']",
  String.raw`content-["hello\_world"]`,
  'bg-red-500/75',
  'w-[100px]',
  'w-[calc(100px*-1)]',
  'w-[calc(100px_*_-1)]',
  'w-[calc(100px-50%)]',
  'w-[calc(100px_-_50%)]',
  'w-[theme(spacing.1)]',
  'w-[theme(spacing[1.5])]',
  'w-[calc(100%-theme(spacing[1.5]))]',
  'w-[calc(100%_-_theme(spacing[1.5]))]',
  "w-[theme('spacing.1)']",
  "w-[theme('spacing[1.5])']",
  "w-[calc(100%-theme('spacing[1.5]))']",
  "w-[calc(100%_-_theme('spacing[1.5]))']",
  `w-[theme("spacing.1)"]`,
  `w-[theme("spacing[1.5])"]`,
  `w-[calc(100%-theme("spacing[1.5]))"]`,
  `w-[calc(100%_-_theme("spacing[1.5]))"]`,
  'bg-[#bada55]',
  'bg-[#bada55]/50',
  'bg-[#bada55]/[0.5]',
  'bg-[color:#bada55]',
  'bg-[color:#bada55]/50',
  'bg-[color:#bada55]/[0.5]',
  'bg-[color:#bada55]/[50%]',
  'bg-[color:#bada55]/[33.7%]',
  'bg-[var(--my-color)]',
  'bg-[var(--my-color)]/50',
  'bg-[var(--my-color)]/[50%]',
  'bg-[var(--my-color)]/[33.7%]',
  'bg-[--my-color]',
  'bg-[--my-color]/50',
  'bg-[--my-color]/[50%]',
  'bg-[--my-color]/[33.7%]',
  'fill-[rgb(13,24,35)]',
  'fill-[rgb(13,24,35)]/50',
  'fill-[rgb(13,24,35)]/[0.5]',
  'fill-[rgb(13,24,35)]/[50%]',
  'fill-[rgb(13,24,35)]/[33.7%]',
  'fill-[rgb(13,_24,_35)]',
  'fill-[rgb(13,_24,_35)]/50',
  'fill-[rgb(13,_24,_35)]/[0.5]',
  'fill-[rgb(13,_24,_35)]/[50%]',
  'fill-[rgb(13,_24,_35)]/[33.7%]',
  'fill-[oklab(59.69%_0.1007_0.1191_/_0.5)]',
  'fill-[oklab(59.69%_0.1007_0.1191_/_0.5)]/50',
  'fill-[oklab(59.69%_0.1007_0.1191_/_0.5)]/[0.5]',
  'fill-[oklab(59.69%_0.1007_0.1191_/_0.5)]/[50%]',
  'fill-[oklab(59.69%_0.1007_0.1191_/_0.5)]/[33.7%]',
  'fill-[color:rgb(13,24,35)]',
  'fill-[color:rgb(13,24,35)]/50',
  'fill-[color:rgb(13,24,35)]/[0.5]',
  'fill-[color:rgb(13,24,35)]/[50%]',
  'fill-[color:rgb(13,24,35)]/[33.7%]',
  'fill-[color:rgb(13,_24,_35)]',
  'fill-[color:rgb(13,_24,_35)]/50',
  'fill-[color:rgb(13,_24,_35)]/[0.5]',
  'fill-[color:rgb(13,_24,_35)]/[50%]',
  'fill-[color:rgb(13,_24,_35)]/[33.7%]',
  'fill-[color:oklab(59.69%_0.1007_0.1191_/_0.5)]',
  'fill-[color:oklab(59.69%_0.1007_0.1191_/_0.5)]/50',
  'fill-[color:oklab(59.69%_0.1007_0.1191_/_0.5)]/[0.5]',
  'fill-[color:oklab(59.69%_0.1007_0.1191_/_0.5)]/[50%]',
  'fill-[color:oklab(59.69%_0.1007_0.1191_/_0.5)]/[33.7%]',
  'shadow-[inset_0_-3em_3em_rgba(0,_0,_0,_0.1),_0_0_0_2px_rgb(255,_255,_255),_0.3em_0.3em_1em_rgba(0,_0,_0,_0.3)]',
  '[background-color:red]',
  '[background-color:#f00]',
  '[background-color:rgb(255,0,0)]',
  '[background-color:rgb(255,_0,_0)]',
  '[box-shadow:inset_0_-3em_3em_rgba(0,_0,_0,_0.1),_0_0_0_2px_rgb(255,_255,_255),_0.3em_0.3em_1em_rgba(0,_0,_0,_0.3)]',
  '[--my-variable:var(--my-other-variable)]',
  '[--my-variable:var(--my-other-variable,initial)]',
  '[--my-variable:var(--my-other-variable,var(--my-fallback))]',
  '[--my-variable:var(--my-other-variable,var(--my-fallback,initial))]',
]

let variantExamples = [
  'md',
  'group-hover',
  'data-[pressed]',
  'min-[500px]',
  'aria-[sort=descending]',
  'aria-[sort="ascending"]',
  'supports-[display:grid]',
  'supports-[display:_flex]',
  'supports-[display:_flex]',
  'supports-[selector(A_>_B)]',
  'supports-[selector(A>B)]',
  'supports-[not_(foo:bar)]',
  'supports-[not(foo:bar)]',
  'supports-[(foo:bar)_or_(bar:baz)]',
  'supports-[(foo:bar)or(bar:baz)]',
  'supports-[(foo:bar)_and_(bar:baz)]',
  'supports-[(foo:bar)and(bar:baz)]',
  '@lg',
  '@[618px]',
  '[&:not(:active)]',
  '[@media(hover:hover)]',
  '[@media(any-hover:_hover)]',
  '[@media_(pointer:_fine)]',
]

let templateExamples = [
  // HTML
  (c) => `<div class="${c}"></div>`,
  (c) => `<div class="potato ${c} salad"></div>`,
  (c) => `<div class="${c} potato salad"></div>`,
  (c) => `<div class="potato salad ${c}"></div>`,

  // Spaghetti JS
  (c) => `let foo = "${c}"`,
  (c) => `let foo = "${c}";`,
  (c) => `let foo = '${c}'`,
  (c) => `let foo = '${c}';`,
  (c) => `let foo = \`${c}\``,
  (c) => `let foo = \`${c}\`;`,
  (c) => `let foo = ["${c}"]`,
  (c) => `let foo = ["${c}"];`,
  (c) => `let foo = ['${c}']`,
  (c) => `let foo = ['${c}'];`,
  (c) => `let foo = [\`${c}\`]`,
  (c) => `let foo = [\`${c}\`];`,
  (c) => `let foo = { ${c}: true };`,
  (c) => `let foo = {${c}: true};`,
  (c) => `let foo = {${c}:true};`,
  (c) => `let foo = {
    ${c}: true
  };`,
  (c) => `let foo = {
    ${c}:true
  };`,
  (c) => `let foo = {
    '${c}': true
  };`,
  (c) => `let foo = {
    ['${c}']: true
  };`,
  (c) => `let foo = {
    "${c}": true
  };`,
  (c) => `let foo = {
    ["${c}"]: true
  };`,
  (c) => `let foo = potato\`${c}\``,
  (c) => `let foo = potato\`salad ${c}\``,
  (c) => `let foo = potato\`salad ${c} sandwich\``,
  (c) => `let foo = potato\`${c} salad sandwich\``,
  (c) => `document.body.classList.add(['${c}'].join(" "));`,

  // JSX
  (c) => `<div className="${c}"></div>`,
  (c) => `<div className="${c} potato salad"></div>`,
  (c) => `<div className="potato ${c} salad"></div>`,
  (c) => `<div className="potato salad ${c}"></div>`,
  (c) => `<div className={\`potato salad \$\{'${c}'\}\`}></div>`,
  (c) => `<div className={\`potato salad \$\{"${c}"\}\`}></div>`,
  (c) => `<div className={\`potato salad \$\{\`${c}\`\}\`}></div>`,

  // Vue
  (c) => `<div :class="{ ${c}: condition }"></div>`,
  (c) => `<div :class="{ '${c}': condition }"></div>`,
  (c) => `<div :class="{ ['${c}']: condition }"></div>`,
  (c) => `<div :class="{ "${c}": condition }"></div>`,
  (c) => `<div :class="{ ["${c}"]: condition }"></div>`,
  (c) => `<div :class="{${c}: condition}"></div>`,
  (c) => `<div :class="{'${c}': condition}"></div>`,
  (c) => `<div :class="{['${c}']: condition}"></div>`,
  (c) => `<div :class="{"${c}": condition}"></div>`,
  (c) => `<div :class="{["${c}"]: condition}"></div>`,
  (c) => `<div :class="{${c}:condition}"></div>`,
  (c) => `<div :class="{'${c}':condition}"></div>`,
  (c) => `<div :class="{['${c}']:condition}"></div>`,
  (c) => `<div :class="{"${c}":condition}"></div>`,
  (c) => `<div :class="{["${c}"]:condition}"></div>`,
  (c) => `<div :class="['${c}', 'potato']"></div>`,
  (c) => `<div :class="['potato', '${c}']"></div>`,
  (c) => `<div :class="['potato', '${c}', 'salad']"></div>`,
]

describe.each([
  ['Regex', regexParser],
  ['Oxide', oxideParser],
])('%s parser', (_, parse) => {
  test('basic utility classes', async () => {
    let extractions = parse(`
      <div class="text-center font-bold px-4 pointer-events-none"></div>
    `)

    expect(extractions).toContain('text-center')
    expect(extractions).toContain('font-bold')
    expect(extractions).toContain('px-4')
    expect(extractions).toContain('pointer-events-none')
  })

  test('modifiers with basic utilities', async () => {
    let extractions = parse(`
      <div class="hover:text-center hover:focus:font-bold"></div>
    `)

    expect(extractions).toContain('hover:text-center')
    expect(extractions).toContain('hover:focus:font-bold')
  })

  test('utilities with dot characters', async () => {
    let extractions = parse(`
      <div class="px-1.5 active:px-2.5 hover:focus:px-3.5"></div>
    `)

    expect(extractions).toContain('px-1.5')
    expect(extractions).toContain('active:px-2.5')
    expect(extractions).toContain('hover:focus:px-3.5')
  })

  test('basic utilities with color opacity modifier', async () => {
    let extractions = parse(`
      <div class="text-red-500/25 hover:text-red-500/50 hover:active:text-red-500/75"></div>
    `)

    expect(extractions).toContain('text-red-500/25')
    expect(extractions).toContain('hover:text-red-500/50')
    expect(extractions).toContain('hover:active:text-red-500/75')
  })

  test('basic arbitrary values', async () => {
    let extractions = parse(`
    <div class="px-[25px] hover:px-[40rem] hover:focus:px-[23vh]"></div>
  `)

    expect(extractions).toContain('px-[25px]')
    expect(extractions).toContain('hover:px-[40rem]')
    expect(extractions).toContain('hover:focus:px-[23vh]')
  })

  test('arbitrary values with color opacity modifier', async () => {
    let extractions = parse(`
    <div class="text-[#bada55]/25 hover:text-[#bada55]/50 hover:active:text-[#bada55]/75"></div>
  `)

    expect(extractions).toContain('text-[#bada55]/25')
    expect(extractions).toContain('hover:text-[#bada55]/50')
    expect(extractions).toContain('hover:active:text-[#bada55]/75')
  })

  test('arbitrary values with spaces', async () => {
    let extractions = parse(`
      <div class="grid-cols-[1fr_200px_3fr] md:grid-cols-[2fr_100px_1fr] open:lg:grid-cols-[3fr_300px_1fr]"></div>
    `)

    expect(extractions).toContain('grid-cols-[1fr_200px_3fr]')
    expect(extractions).toContain('md:grid-cols-[2fr_100px_1fr]')
    expect(extractions).toContain('open:lg:grid-cols-[3fr_300px_1fr]')
  })

  test('arbitrary values with CSS variables', async () => {
    let extractions = parse(`
      <div class="fill-[var(--my-color)] hover:fill-[var(--my-color-2)] hover:focus:fill-[var(--my-color-3)]"></div>
    `)

    expect(extractions).toContain('fill-[var(--my-color)]')
    expect(extractions).toContain('hover:fill-[var(--my-color-2)]')
    expect(extractions).toContain('hover:focus:fill-[var(--my-color-3)]')
  })

  test('arbitrary values with type hints', async () => {
    let extractions = parse(`
      <div class="text-[color:var(--my-color)] hover:text-[color:var(--my-color-2)] hover:focus:text-[color:var(--my-color-3)]"></div>
    `)

    expect(extractions).toContain('text-[color:var(--my-color)]')
    expect(extractions).toContain('hover:text-[color:var(--my-color-2)]')
    expect(extractions).toContain('hover:focus:text-[color:var(--my-color-3)]')
  })

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

  test('basic utilities with arbitrary color opacity modifier', async () => {
    let extractions = parse(`
      <div class="text-red-500/[.25] hover:text-red-500/[.5] hover:active:text-red-500/[.75]"></div>
    `)

    expect(extractions).toContain('text-red-500/[.25]')
    expect(extractions).toContain('hover:text-red-500/[.5]')
    expect(extractions).toContain('hover:active:text-red-500/[.75]')
  })

  test('arbitrary values with arbitrary color opacity modifier', async () => {
    let extractions = parse(`
      <div class="text-[#bada55]/[.25] hover:text-[#bada55]/[.5] hover:active:text-[#bada55]/[.75]"></div>
    `)

    expect(extractions).toContain('text-[#bada55]/[.25]')
    expect(extractions).toContain('hover:text-[#bada55]/[.5]')
    expect(extractions).toContain('hover:active:text-[#bada55]/[.75]')
  })

  test('arbitrary values with angle brackets', async () => {
    let extractions = parse(`
      <div class="content-[>] hover:content-[<] hover:focus:content-[>]"></div>
    `)

    expect(extractions).toContain(`content-[>]`)
    expect(extractions).toContain(`hover:content-[<]`)
    expect(extractions).toContain(`hover:focus:content-[>]`)
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

  test.skip('special characters', async () => {
    let extractions = parse(`
      <div class="<sm:underline md>:font-bold"></div>
    `)

    expect(extractions).toContain(`<sm:underline`)
    expect(extractions).toContain(`md>:font-bold`)
  })

  test.skip('with single quotes array within template literal', async () => {
    let extractions = parse(`<div class=\`\${['pr-1.5']}\`></div>`)

    expect(extractions).toContain('pr-1.5')
  })

  test.skip('with double quotes array within template literal', async () => {
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

  test.skip('classes in slim templates', async () => {
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
    test.skip('Class object syntax', () => {
      let extractions = parse(
        `<div :class="{ underline: myCondition, 'font-bold': myCondition }">[foo]</div>`
      )

      expect(extractions).toContain(`underline`, `font-bold`)
    })
    test.skip('Class array syntax', () => {
      let extractions = parse(
        `<div :class="['underline', myCondition && 'font-bold', myCondition ? 'flex' : 'block']">[foo]</div>`
      )

      expect(extractions).toContain(`underline`, `font-bold`, `flex`, `block`)
    })
  })
})
