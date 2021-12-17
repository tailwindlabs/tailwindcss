import { html } from './util/run'
import { defaultExtractor } from '../src/lib/defaultExtractor'

let jsxExample = "<div className={`overflow-scroll${conditionIsOpen ? '' : ' hidden'}`}></div>"
const input =
  html`
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
    let classes14 = ["<div class='hover:test'>"]

    let obj = {
      uppercase:true
    }
  </script>
` + jsxExample

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
  `uppercase`,
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
  `hover:test`,
  `overflow-scroll`,
]

const excludes = [
  `uppercase:`,
  'hover:',
  "hover:'abc",
  `font-bold`,
  `<div class='hover:test'>`,
  `test`,
]

test('The default extractor works as expected', async () => {
  const extractions = defaultExtractor(input.trim())

  for (const str of includes) {
    expect(extractions).toContain(str)
  }

  for (const str of excludes) {
    expect(extractions).not.toContain(str)
  }
})
