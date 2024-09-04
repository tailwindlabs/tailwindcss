import { html } from './util/run'
import { defaultExtractor as createDefaultExtractor } from '../src/lib/defaultExtractor'

const jsExamples = `
  document.body.classList.add(["pl-1.5"].join(" "));
  document.body.classList.add(['pl-2.5'].join(" "));
`
const jsxExamples = `
  <div className={\`overflow-scroll\${conditionIsOpen ? '' : ' hidden'}\`}></div>
  <div className={\`\${['pr-1.5'].join(' ')}\`}><div>
  <div className={\`\${['pr-2.5', 'pr-3.5'].join(' ')}\`}><div>
  <div className={\`\${["pr-4.5"].join(' ')}\`}><div>
  <div className={\`\${["pr-5.5", "pr-6.5"].join(' ')}\`}><div>
  <div className={\`\${['h-[100px]'].join(' ')}\`}><div>
  <div className={\`\${['h-[101px]', 'h-[102px]'].join(' ')}\`}><div>
  <div className={\`\${["h-[103px]"].join(' ')}\`}><div>
  <div className={\`\${["h-[104px]", "h-[105px]"].join(' ')}\`}><div>
`
const htmlExamples = html`
  <div class="font-['some_font',sans-serif]"></div>
  <div class='font-["some_font",sans-serif]'></div>
  <div class="bg-[url('...')]"></div>
  <div class="bg-[url("...")]"></div>
  <div class="bg-[url('...'),url('...')]"></div>
  <div class="bg-[url("..."),url("...")]"></div>
  <div class="content-['hello']"></div>
  <div class="content-['hello']']"></div>
  <div class="content-["hello"]"></div>
  <div class="content-["hello"]"]"></div>
  <div class="[content:'hello']"></div>
  <div class="[content:"hello"]"></div>
  <div class="[content:"hello"]"></div>
  <div class="[content:'hello']"></div>
  <div class="fill-[#bada55]"></div>
  <div class="fill-[#bada55]/50"></div>
  <div class="px-1.5"></div>
  <div class="uppercase"></div>
  <div class="uppercase:"></div>
  <div class="hover:font-bold"></div>
  <div class="content-['>']"></div>
  <div class="[--y:theme(colors.blue.500)]">
  <div class="w-[calc(100%-theme('spacing.1'))]">
  <div class='w-[calc(100%-theme("spacing.2"))]'>
  <div class='w-[calc(100%-theme("spacing[2]"))]'>
  <div class='w-[calc(100%-theme(spacing[2]))]'>
  <div class='[width:calc(theme(spacing[2])_+_theme(spacing[3])_+_theme(spacing[4]))]'>

  <script>
    let classes01 = ["text-[10px]"]
    let classes02 = ["hover:font-bold"]
    let classes03 = {"code": "<div class=\"text-sm text-blue-500\"></div>"}
    let classes04 = ['text-[11px]']
    let classes05 = ['text-[21px]', 'text-[22px]', 'lg:text-[24px]']
    let classes06 = ["text-[31px]", "text-[32px]"]
    let classes07 = [${'`'}text-[41px]${'`'}, ${'`'}text-[42px]${'`'}]
    let classes08 = {"text-[51px]":"text-[52px]"}
    let classes09 = {'text-[61px]':'text-[62px]'}
    let classes10 = {${'`'}text-[71px]${'`'}:${'`'}text-[72px]${'`'}}
    let classes11 = ['hover:']
    let classes12 = ['hover:\'abc']
    let classes13 = ["lg:text-[4px]"]
    let classes14 = ["<div class='hover:underline'>"]
    let classes15 = ["<div class='hover:test'>"] // unknown so dont generate
    let classes16 = ["font-[arbitrary,'arbitrary_with_space']"]
    let classes17 = ["font-['arbitrary_with_space','arbitrary_2']"]
    let classes18 = ["bg-[url('/images/one-two-three.png'),linear-gradient(to_right,_#eeeeee,_#000000)]"]

    let obj = {
      lowercase: true,
      "normal-case": true,
      'ml-0.5': true,
      'ml-0.5': true,
      'h-[106px]': true,
      "h-[107px]": true,
    }
    let obj2 = {
      'h-[108px]': true
    }
    let obj3 = {
      "h-[109px]": true
    }
  </script>
  <script type="text/twig">
    element['#border_color']|default('border-[color:var(--color,theme(colors.cyan.500))]')
    {% if settings == 'foo'%}translate-x-[var(--scroll-offset)]{% endif %}
  </script>
`

const includes = [
  `font-['some_font',sans-serif]`,
  `font-["some_font",sans-serif]`,
  `bg-[url('...')]`,
  `bg-[url("...")]`,
  `bg-[url('...'),url('...')]`,
  `bg-[url("..."),url("...")]`,
  `content-['hello']`,
  `content-["hello"]`,
  `[content:'hello']`,
  `[content:"hello"]`,
  `[content:"hello"]`,
  `[content:'hello']`,
  `fill-[#bada55]`,
  `fill-[#bada55]/50`,
  `px-1.5`,
  `pl-1.5`,
  `pl-2.5`,
  `pr-1.5`,
  `pr-2.5`,
  `pr-3.5`,
  `pr-4.5`,
  `pr-5.5`,
  `pr-6.5`,
  `ml-0.5`,
  `h-[100px]`,
  `h-[101px]`,
  `h-[102px]`,
  `h-[103px]`,
  `h-[104px]`,
  `h-[105px]`,
  `h-[106px]`,
  `h-[107px]`,
  `h-[108px]`,
  `h-[109px]`,
  `uppercase`,
  `lowercase`,
  `normal-case`,
  `hover:font-bold`,
  `text-sm`,
  `text-[10px]`,
  `text-[11px]`,
  `text-blue-500`,
  `text-[21px]`,
  `text-[22px]`,
  `text-[31px]`,
  `text-[32px]`,
  `text-[41px]`,
  `text-[42px]`,
  `text-[51px]`,
  `text-[52px]`,
  `text-[61px]`,
  `text-[62px]`,
  `text-[71px]`,
  `text-[72px]`,
  `lg:text-[4px]`,
  `lg:text-[24px]`,
  `content-['>']`,
  `hover:underline`,
  `overflow-scroll`,
  `[--y:theme(colors.blue.500)]`,
  `w-[calc(100%-theme('spacing.1'))]`,
  `w-[calc(100%-theme("spacing.2"))]`,
  `w-[calc(100%-theme("spacing.2"))]`,
  `w-[calc(100%-theme("spacing[2]"))]`,
  `w-[calc(100%-theme(spacing[2]))]`,
  `[width:calc(theme(spacing[2])_+_theme(spacing[3])_+_theme(spacing[4]))]`,
  `border-[color:var(--color,theme(colors.cyan.500))]`,
  `translate-x-[var(--scroll-offset)]`,
  `font-[arbitrary,'arbitrary_with_space']`,
  `font-['arbitrary_with_space','arbitrary_2']`,
  `bg-[url('/images/one-two-three.png'),linear-gradient(to_right,_#eeeeee,_#000000)]`,
]

const excludes = [
  `uppercase:`,
  'hover:',
  "hover:'abc",
  `font-bold`,
  `<div class='hover:underline'>`,
  `<div class='hover:test'>`,
  `test`,
]

let defaultExtractor

beforeEach(() => {
  let context = { tailwindConfig: { separator: ':' } }
  defaultExtractor = createDefaultExtractor(context)
})

test('The default extractor works as expected', async () => {
  const extractions = defaultExtractor([jsExamples, jsxExamples, htmlExamples].join('\n').trim())

  for (const str of includes) {
    expect(extractions).toContain(str)
  }

  for (const str of excludes) {
    expect(extractions).not.toContain(str)
  }
})

// Scenarios:
// - In double quoted class attribute
// - In single quoted class attribute
// - Single-quoted as a variable
// - Double-quoted as a variable
// - Single-quoted as first array item
// - Double-quoted as first array item
// - Single-quoted as middle array item
// - Double-quoted as middle array item
// - Single-quoted as last array item
// - Double-quoted as last array item
// - Bare as an object key (with trailing `:`)
// - Quoted as an object key (with trailing `:`)
// - Within a template literal
// - Within a template literal directly before interpolation
// - Within a template literal directly after interpolation
//   - JS: ${...}
//   - PHP: {$...}
//   - Ruby: #{...}
// - Within a string of HTML wrapped in escaped quotes

test('basic utility classes', async () => {
  const extractions = defaultExtractor(`
    <div class="text-center font-bold px-4 pointer-events-none"></div>
  `)

  expect(extractions).toContain('text-center')
  expect(extractions).toContain('font-bold')
  expect(extractions).toContain('px-4')
  expect(extractions).toContain('pointer-events-none')
})

test('modifiers with basic utilities', async () => {
  const extractions = defaultExtractor(`
    <div class="hover:text-center hover:focus:font-bold"></div>
  `)

  expect(extractions).toContain('hover:text-center')
  expect(extractions).toContain('hover:focus:font-bold')
})

test('utilities with dot characters', async () => {
  const extractions = defaultExtractor(`
    <div class="px-1.5 active:px-2.5 hover:focus:px-3.5"></div>
  `)

  expect(extractions).toContain('px-1.5')
  expect(extractions).toContain('active:px-2.5')
  expect(extractions).toContain('hover:focus:px-3.5')
})

test('basic utilities with color opacity modifier', async () => {
  const extractions = defaultExtractor(`
    <div class="text-red-500/25 hover:text-red-500/50 hover:active:text-red-500/75"></div>
  `)

  expect(extractions).toContain('text-red-500/25')
  expect(extractions).toContain('hover:text-red-500/50')
  expect(extractions).toContain('hover:active:text-red-500/75')
})

test('basic arbitrary values', async () => {
  const extractions = defaultExtractor(`
    <div class="px-[25px] hover:px-[40rem] hover:focus:px-[23vh]"></div>
  `)

  expect(extractions).toContain('px-[25px]')
  expect(extractions).toContain('hover:px-[40rem]')
  expect(extractions).toContain('hover:focus:px-[23vh]')
})

test('arbitrary values with color opacity modifier', async () => {
  const extractions = defaultExtractor(`
    <div class="text-[#bada55]/25 hover:text-[#bada55]/50 hover:active:text-[#bada55]/75"></div>
  `)

  expect(extractions).toContain('text-[#bada55]/25')
  expect(extractions).toContain('hover:text-[#bada55]/50')
  expect(extractions).toContain('hover:active:text-[#bada55]/75')
})

test('arbitrary values with spaces', async () => {
  const extractions = defaultExtractor(`
    <div class="grid-cols-[1fr_200px_3fr] md:grid-cols-[2fr_100px_1fr] open:lg:grid-cols-[3fr_300px_1fr]"></div>
  `)

  expect(extractions).toContain('grid-cols-[1fr_200px_3fr]')
  expect(extractions).toContain('md:grid-cols-[2fr_100px_1fr]')
  expect(extractions).toContain('open:lg:grid-cols-[3fr_300px_1fr]')
})

test('arbitrary values with css variables', async () => {
  const extractions = defaultExtractor(`
    <div class="fill-[var(--my-color)] hover:fill-[var(--my-color-2)] hover:focus:fill-[var(--my-color-3)]"></div>
  `)

  expect(extractions).toContain('fill-[var(--my-color)]')
  expect(extractions).toContain('hover:fill-[var(--my-color-2)]')
  expect(extractions).toContain('hover:focus:fill-[var(--my-color-3)]')
})

test('arbitrary values with type hints', async () => {
  const extractions = defaultExtractor(`
    <div class="text-[color:var(--my-color)] hover:text-[color:var(--my-color-2)] hover:focus:text-[color:var(--my-color-3)]"></div>
  `)

  expect(extractions).toContain('text-[color:var(--my-color)]')
  expect(extractions).toContain('hover:text-[color:var(--my-color-2)]')
  expect(extractions).toContain('hover:focus:text-[color:var(--my-color-3)]')
})

test('arbitrary values with single quotes', async () => {
  const extractions = defaultExtractor(`
    <div class="content-['hello_world'] hover:content-['hello_world_2'] hover:focus:content-['hello_world_3']"></div>
  `)

  expect(extractions).toContain(`content-['hello_world']`)
  expect(extractions).toContain(`hover:content-['hello_world_2']`)
  expect(extractions).toContain(`hover:focus:content-['hello_world_3']`)
})

test('arbitrary values with double quotes', async () => {
  const extractions = defaultExtractor(`
    <div class='content-["hello_world"] hover:content-["hello_world_2"] hover:focus:content-["hello_world_3"]'></div>
  `)

  expect(extractions).toContain(`content-["hello_world"]`)
  expect(extractions).toContain(`hover:content-["hello_world_2"]`)
  expect(extractions).toContain(`hover:focus:content-["hello_world_3"]`)
})

test('arbitrary values with some single quoted values', async () => {
  const extractions = defaultExtractor(`
    <div class="font-['Open_Sans',_system-ui,_sans-serif] hover:font-['Proxima_Nova',_system-ui,_sans-serif] hover:focus:font-['Inter_var',_system-ui,_sans-serif]"></div>
  `)

  expect(extractions).toContain(`font-['Open_Sans',_system-ui,_sans-serif]`)
  expect(extractions).toContain(`hover:font-['Proxima_Nova',_system-ui,_sans-serif]`)
  expect(extractions).toContain(`hover:focus:font-['Inter_var',_system-ui,_sans-serif]`)
})

test('arbitrary values with some double quoted values', async () => {
  const extractions = defaultExtractor(`
    <div class='font-["Open_Sans",_system-ui,_sans-serif] hover:font-["Proxima_Nova",_system-ui,_sans-serif] hover:focus:font-["Inter_var",_system-ui,_sans-serif]'></div>
  `)

  expect(extractions).toContain(`font-["Open_Sans",_system-ui,_sans-serif]`)
  expect(extractions).toContain(`hover:font-["Proxima_Nova",_system-ui,_sans-serif]`)
  expect(extractions).toContain(`hover:focus:font-["Inter_var",_system-ui,_sans-serif]`)
})

test('arbitrary values with escaped underscores', async () => {
  const extractions = defaultExtractor(`
    <div class="content-['hello\\_world'] hover:content-['hello\\_world\\_2'] hover:focus:content-['hello\\_world\\_3']"></div>
  `)

  expect(extractions).toContain(`content-['hello\\_world']`)
  expect(extractions).toContain(`hover:content-['hello\\_world\\_2']`)
  expect(extractions).toContain(`hover:focus:content-['hello\\_world\\_3']`)
})

test('basic utilities with arbitrary color opacity modifier', async () => {
  const extractions = defaultExtractor(`
    <div class="text-red-500/[.25] hover:text-red-500/[.5] hover:active:text-red-500/[.75]"></div>
  `)

  expect(extractions).toContain('text-red-500/[.25]')
  expect(extractions).toContain('hover:text-red-500/[.5]')
  expect(extractions).toContain('hover:active:text-red-500/[.75]')
})

test('arbitrary values with arbitrary color opacity modifier', async () => {
  const extractions = defaultExtractor(`
    <div class="text-[#bada55]/[.25] hover:text-[#bada55]/[.5] hover:active:text-[#bada55]/[.75]"></div>
  `)

  expect(extractions).toContain('text-[#bada55]/[.25]')
  expect(extractions).toContain('hover:text-[#bada55]/[.5]')
  expect(extractions).toContain('hover:active:text-[#bada55]/[.75]')
})

test('arbitrary values with angle brackets', async () => {
  const extractions = defaultExtractor(`
    <div class="content-[>] hover:content-[<] hover:focus:content-[>]"></div>
  `)

  expect(extractions).toContain(`content-[>]`)
  expect(extractions).toContain(`hover:content-[<]`)
  expect(extractions).toContain(`hover:focus:content-[>]`)
})

test('arbitrary values with angle brackets in single quotes', async () => {
  const extractions = defaultExtractor(`
    <div class="content-['>'] hover:content-['<'] hover:focus:content-['>']"></div>
  `)

  expect(extractions).toContain(`content-['>']`)
  expect(extractions).toContain(`hover:content-['<']`)
  expect(extractions).toContain(`hover:focus:content-['>']`)
})

test('arbitrary values with angle brackets in double quotes', async () => {
  const extractions = defaultExtractor(`
    <div class="content-[">"] hover:content-["<"] hover:focus:content-[">"]"></div>
  `)

  expect(extractions).toContain(`content-[">"]`)
  expect(extractions).toContain(`hover:content-["<"]`)
  expect(extractions).toContain(`hover:focus:content-[">"]`)
})

test('arbitrary values with theme lookup using quotes', () => {
  const extractions = defaultExtractor(`
    <p class="[--y:theme('colors.blue.500')] [color:var(--y)]"></p>
  `)

  expect(extractions).toContain(`[--y:theme('colors.blue.500')]`)
  expect(extractions).toContain(`[color:var(--y)]`)
})

test('special characters', async () => {
  const extractions = defaultExtractor(`
    <div class="<sm:underline md>:font-bold"></div>
  `)

  expect(extractions).toContain(`<sm:underline`)
  expect(extractions).toContain(`md>:font-bold`)
})

test('with single quotes array within template literal', async () => {
  const extractions = defaultExtractor(`<div class=\`\${['pr-1.5']}\`></div>`)

  expect(extractions).toContain('pr-1.5')
})

test('with double quotes array within template literal', async () => {
  const extractions = defaultExtractor(`<div class=\`\${["pr-1.5"]}\`></div>`)

  expect(extractions).toContain('pr-1.5')
})

test('with single quotes array within function', async () => {
  const extractions = defaultExtractor(`document.body.classList.add(['pl-1.5'].join(" "));`)

  expect(extractions).toContain('pl-1.5')
})

test('with double quotes array within function', async () => {
  const extractions = defaultExtractor(`document.body.classList.add(["pl-1.5"].join(" "));`)

  expect(extractions).toContain('pl-1.5')
})

test('with angle brackets', async () => {
  const extractions = defaultExtractor(
    `<div class="bg-blue-200 <% if (useShadow) { %>shadow-xl<% } %>">test</div>`
  )

  expect(extractions).toContain('bg-blue-200')
  expect(extractions).toContain('shadow-xl')
  expect(extractions).not.toContain('>shadow-xl')
  expect(extractions).not.toContain('shadow-xl<')
})

test('markdown code fences', async () => {
  const extractions = defaultExtractor('<!-- this should work: `.font-bold`, `.font-normal` -->')

  expect(extractions).toContain('font-bold')
  expect(extractions).toContain('font-normal')
  expect(extractions).not.toContain('.font-bold')
  expect(extractions).not.toContain('.font-normal')
})

test('classes in slim templates', async () => {
  const extractions = defaultExtractor(`
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

test('classes in slim templates starting with number', async () => {
  const extractions = defaultExtractor(`
    .bg-green-300.2xl:bg-red-300
      '(Look mom, no closing tag!)
  `)

  expect(extractions).toContain('bg-green-300')
  expect(extractions).toContain('2xl:bg-red-300')
})

test('classes in slim templates with attributes added', () => {
  let extractions = defaultExtractor(`
    .ml-auto[
      data-value='foo'
    ]
      Foo bar
    .mr-auto[data-value='foo']
      Foo bar
    .mt-auto#omg
      Foo bar
    #omg.mb-auto
      Foo bar
  `)

  expect(extractions).toContain(`ml-auto`)
  expect(extractions).toContain(`mr-auto`)
  expect(extractions).toContain(`mt-auto`)
  expect(extractions).toContain(`mb-auto`)
})

test("classes with fractional numeric values don't also generate the whole number utility", async () => {
  const extractions = defaultExtractor(`
    <div class="px-1.5 py-2.75">Hello world!</div>
  `)

  expect(extractions).toContain('px-1.5')
  expect(extractions).toContain('py-2.75')
  expect(extractions).not.toContain('px-1')
  expect(extractions).not.toContain('5')
  expect(extractions).not.toContain('py-2')
  expect(extractions).not.toContain('75')
})

test('multi-word + arbitrary values + quotes', async () => {
  const extractions = defaultExtractor(`
    grid-cols-['repeat(2)']
  `)

  expect(extractions).toContain(`grid-cols-['repeat(2)']`)
})

test('a lot of data', () => {
  let extractions = defaultExtractor('underline '.repeat(2 ** 17))

  expect(extractions).toContain(`underline`)
})

test('ruby percent string array', () => {
  let extractions = defaultExtractor('%w[text-[#bada55]]')

  expect(extractions).toContain(`text-[#bada55]`)
})

test('arbitrary properties followed by square bracketed stuff', () => {
  let extractions = defaultExtractor(
    '<div class="h-16 items-end border border-white [display:inherit]">[foo]</div>'
  )

  expect(extractions).toContain(`[display:inherit]`)
})

it.each([
  ['["min-w-[17rem]","max-w-[17rem]"]', ['min-w-[17rem]', 'max-w-[17rem]']],
  [
    '["w-[calc(theme(spacing[2]*-1px))]","h-[calc(theme(spacing[2]*-1px))]"]',
    ['w-[calc(theme(spacing[2]*-1px))]', 'h-[calc(theme(spacing[2]*-1px))]'],
  ],
])('should work for issue #12371 (%#)', async (content, expectations) => {
  let extractions = defaultExtractor(content)

  for (let value of expectations) {
    expect(extractions).toContain(value)
  }
})

it.each([
  ['@container', ['@container']],
  ['@container/sidebar', ['@container/sidebar']],
  ['@container/[sidebar]', ['@container/[sidebar]']],
  ['@container-size', ['@container-size']],
  ['@container-size/sidebar', ['@container-size/sidebar']],
  ['@container-[size]/sidebar', ['@container-[size]/sidebar']],
  ['@container-[size]/[sidebar]', ['@container-[size]/[sidebar]']],
])('should support utilities starting with @ (%#)', async (content, expectations) => {
  let extractions = defaultExtractor(content)

  for (let value of expectations) {
    expect(extractions).toContain(value)
  }
})
