import { html } from './util/run'
import { defaultExtractor } from '../src/lib/defaultExtractor'

const input = html`
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

  <script>
    let classes1 = ["text-[10px]"]
    let classes2 = ["hover:font-bold"]
    let classes3 = {"code": "<div class=\"text-blue-500\"></div>"} -->
    let classes4 = ['text-[11px]']
    let classes5 = ['text-[21px]', 'text-[22px]']
    let classes5 = ["text-[31px]", "text-[32px]"]
    let classes5 = [\`text-[41px]\`, \`text-[42px]\`]
    let obj = {
      uppercase:true
    }
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
  `uppercase`,
  `hover:font-bold`,
  `text-[10px]`,
  `text-[11px]`,
  `text-blue-500`,
  `text-[21px]`,
  `text-[22px]`,
  `text-[31px]`,
  `text-[32px]`,
]

const excludes = [`uppercase:`, `font-bold`]

test('The default extractor works as expected', async () => {
  const extractions = defaultExtractor(input.trim())

  console.log(Array.from(new Set(extractions)).sort())

  for (const str of includes) {
    expect(extractions).toContain(str)
  }

  for (const str of excludes) {
    expect(extractions).not.toContain(str)
  }
})
