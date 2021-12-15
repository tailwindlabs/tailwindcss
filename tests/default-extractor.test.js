import extract from '../src/lib/defaultExtractor'

const html = String.raw

const table = [
  {
    input: '',
    output: [],
  },
  {
    input: html`text-lg`,
    output: ["text-lg"],
  },
  {
    input: html` <div class="decoration-[3px] decoration-[#ccc]"></div>`,
    output: [
      "/div",
      "/div>",
      "<",
      ">",
      "3px",
      "ccc",
      "class",
      "class=",
      "decoration-",
      "decoration-[#ccc]",
      "decoration-[3px]",
      "div",
    ],
  },
  {
    input: html` <div class="hover:bg-[url('https://github.com/tailwindlabs.png')]"></div>`,
    output: [
      "/div",
      "/div>",
      "<",
      ">",
      "class",
      "class=",
      "com/tailwindlabs",
      "div",
      "hover:bg-",
      "hover:bg-[url('https://github.com/tailwindlabs.png')]",
      "https://github",
      "png",
      "url",
    ]
  },
  {
    input: html`
      <!-- Lookup -->
      <div class="bg-gradient-to-r"></div>
      <div class="bg-red-500"></div>

      <!-- By implicit type -->
      <div class="bg-[url('/image-1-0.png')]"></div>
      <div class="bg-[#ff0000]"></div>

      <!-- By explicit type -->
      <div class="bg-[url:var(--image-url)]"></div>
      <div class="bg-[color:var(--bg-color)]"></div>
    `,
    output: [
      "--",
      "-->",
      "--bg-color",
      "--image-url",
      "!--",
      "/div",
      "/div>",
      "/image-1-0",
      "<",
      ">",
      "bg-",
      "bg-[#ff0000]",
      "bg-[color:var(--bg-color)]",
      "bg-[url:var(--image-url)]",
      "bg-[url('/image-1-0.png')]",
      "bg-gradient-to-r",
      "bg-red-500",
      "By",
      "class",
      "class=",
      "color:var",
      "div",
      "explicit",
      "ff0000",
      "implicit",
      "Lookup",
      "png",
      "type",
      "url:var",
      "url",
    ]
  },
  {
    input: html`<div class="inset-[hmm:12px]"></div>`,
    output: [
      "/div",
      "/div>",
      "<",
      ">",
      "class",
      "class=",
      "div",
      "hmm:12px",
      "inset-",
      "inset-[hmm:12px]",
    ]
  },
  {
    input: html`<div class="w-[length:12px]"></div>`,
    output: [
      "/div",
      "/div>",
      "<",
      ">",
      "class",
      "class=",
      "div",
      "length:12px",
      "w-",
      "w-[length:12px]",
    ]
  },
  {
    input: html`
      <div class="grid-cols-[200px_repeat(auto-fill,minmax(15%,100px))_300px]"></div>
      <div class="grid-rows-[200px_repeat(auto-fill,minmax(15%,100px))_300px]"></div>
      <div class="shadow-[0px_0px_4px_black]"></div>
      <div class="rounded-[0px_4px_4px_0px]"></div>
      <div class="m-[8px_4px]"></div>
      <div class="p-[8px_4px]"></div>
      <div class="flex-[1_1_100%]"></div>
      <div class="col-[span_3_/_span_8]"></div>
      <div class="row-[span_3_/_span_8]"></div>
      <div class="auto-cols-[minmax(0,_1fr)]"></div>
      <div class="drop-shadow-[0px_1px_3px_black]"></div>
      <div class="content-[_hello_world_]"></div>
      <div class="content-[___abc____]"></div>
      <div class="content-['__hello__world__']"></div>
    `,
    output: [
      "___abc____",
      "__hello__world__",
      "_300px",
      "_hello_world_",
      ",100px",
      "/div",
      "/div>",
      "<",
      ">",
      "0,_1fr",
      "0px_0px_4px_black",
      "0px_1px_3px_black",
      "0px_4px_4px_0px",
      "1_1_100",
      "8px_4px",
      "15",
      "200px_repeat",
      "auto-cols-",
      "auto-cols-[minmax(0,_1fr)]",
      "auto-fill,minmax",
      "class",
      "class=",
      "col-",
      "col-[span_3_/_span_8]",
      "content-",
      "content-[___abc____]",
      "content-[_hello_world_]",
      "content-['__hello__world__']",
      "div",
      "drop-shadow-",
      "drop-shadow-[0px_1px_3px_black]",
      "flex-",
      "flex-[1_1_100%]",
      "grid-cols-",
      "grid-cols-[200px_repeat(auto-fill,minmax(15%,100px))_300px]",
      "grid-rows-",
      "grid-rows-[200px_repeat(auto-fill,minmax(15%,100px))_300px]",
      "m-",
      "m-[8px_4px]",
      "minmax",
      "p-",
      "p-[8px_4px]",
      "rounded-",
      "rounded-[0px_4px_4px_0px]",
      "row-",
      "row-[span_3_/_span_8]",
      "shadow-",
      "shadow-[0px_0px_4px_black]",
      "span_3_/_span_8",
    ]
  },
  {
    input: html`<div class="content-['snake\\_case']"></div>`,
    output: [
      "/div",
      "/div>",
      "<",
      ">",
      "class",
      "class=",
      "content-",
      "content-['snake\\\\_case']",
      "div",
      "snake\\\\_case",
    ],
  },
  {
    input: html`<div class="bg-[200px_100px]"></div>`,
    output: [
      "/div",
      "/div>",
      "<",
      ">",
      "200px_100px",
      "bg-",
      "bg-[200px_100px]",
      "class",
      "class=",
      "div",
    ],
  },
  {
    input: html`<div class="bg-[url('https://www.spacejam.com/1996/img/bg_stars.gif')]"></div>`,
    output: [
      "/div",
      "/div>",
      "<",
      ">",
      "bg-",
      "bg-[url('https://www.spacejam.com/1996/img/bg_stars.gif')]",
      "class",
      "class=",
      "com/1996/img/bg_stars",
      "div",
      "gif",
      "https://www",
      "spacejam",
      "url",
    ],
  },
  {
    input: html`<div class="bg-[url('brown_potato.jpg'),_url('red_tomato.png')]"></div>`,
    output: [
      ",_url",
      "/div",
      "/div>",
      "<",
      ">",
      "bg-",
      "bg-[url('brown_potato.jpg'),_url('red_tomato.png')]",
      "brown_potato",
      "class",
      "class=",
      "div",
      "jpg",
      "png",
      "red_tomato",
      "url",
    ],
  },
]

test.each(table)('Extract $input', ({ input, output }) => {
  expect([...new Set(extract(input))].sort()).toEqual([...new Set(output)].sort())
})
