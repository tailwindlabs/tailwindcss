import { defaultExtractor } from '../src/lib/defaultExtractor'

const input = `
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
]

const excludes = [
  `uppercase:`,
  `font-bold`,
]

test('The default extractor works as expected', async () => {
  const extractions = defaultExtractor(input.trim())

  console.log(extractions)

  for (const str of includes) {
    expect(extractions).toContain(str)
  }

  for (const str of excludes) {
    expect(extractions).not.toContain(str)
  }
})
