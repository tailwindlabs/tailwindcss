import dedent from 'dedent'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { expect, test } from 'vitest'
import { compile } from '..'
import { toCss } from '../ast'
import * as CSS from '../css-parser'
import createPlugin from '../plugin'
import { createSourceMap } from './source-map'
import { visualize } from './visualizer'
const css = dedent

interface RunOptions {
  input: string
  candidates?: string[]
  options?: Parameters<typeof compile>[1]
}

async function run({ input, candidates, options }: RunOptions) {
  let root = path.resolve(__dirname, '../..')

  let compiler = await compile(input, {
    from: 'input.css',
    async loadStylesheet(id, base) {
      let resolvedPath = path.resolve(root, id === 'tailwindcss' ? 'index.css' : id)

      return {
        path: path.relative(root, resolvedPath),
        base,
        content: await fs.readFile(resolvedPath, 'utf-8'),
      }
    },
    ...options,
  })

  let css = compiler.build(candidates ?? [])
  let decoded = compiler.buildSourceMap()

  return visualize(css, decoded)
}

async function analyze({ input }: RunOptions) {
  let ast = CSS.parse(input, { from: 'input.css' })
  let css = toCss(ast, true)
  let decoded = createSourceMap({ ast })
  return visualize(css, decoded)
}

test('source maps trace back to @import location', async () => {
  let visualized = await run({
    input: css`
      @import 'tailwindcss';

      .foo {
        @apply underline;
      }
    `,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - index.css
    - theme.css
    - preflight.css
    - input.css

    VISUALIZATION
          /* input: index.css */
          @layer theme, base, components, utilities;
    #1    -----------------------------------------
          
          @import './theme.css' layer(theme);
    #2    ----------------------------------
          @import './preflight.css' layer(base);
    #10   -------------------------------------
          @import './utilities.css' layer(utilities);
    #147  ------------------------------------------
          
          /* input: theme.css */
          @theme default {
    #3    ---------------
            --font-sans:
    #4      ^
              ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    #4    ^
              'Noto Color Emoji';
    #5    ----------------------
            --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
            --font-mono:
    #6      ^
              ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    #6    ^
              monospace;
    #7    -------------
          
            --color-red-50: oklch(97.1% 0.013 17.38);
            --color-red-100: oklch(93.6% 0.032 17.717);
            --color-red-200: oklch(88.5% 0.062 18.334);
            --color-red-300: oklch(80.8% 0.114 19.571);
            --color-red-400: oklch(70.4% 0.191 22.216);
            --color-red-500: oklch(63.7% 0.237 25.331);
            --color-red-600: oklch(57.7% 0.245 27.325);
            --color-red-700: oklch(50.5% 0.213 27.518);
            --color-red-800: oklch(44.4% 0.177 26.899);
            --color-red-900: oklch(39.6% 0.141 25.723);
            --color-red-950: oklch(25.8% 0.092 26.042);
          
            --color-orange-50: oklch(98% 0.016 73.684);
            --color-orange-100: oklch(95.4% 0.038 75.164);
            --color-orange-200: oklch(90.1% 0.076 70.697);
            --color-orange-300: oklch(83.7% 0.128 66.29);
            --color-orange-400: oklch(75% 0.183 55.934);
            --color-orange-500: oklch(70.5% 0.213 47.604);
            --color-orange-600: oklch(64.6% 0.222 41.116);
            --color-orange-700: oklch(55.3% 0.195 38.402);
            --color-orange-800: oklch(47% 0.157 37.304);
            --color-orange-900: oklch(40.8% 0.123 38.172);
            --color-orange-950: oklch(26.6% 0.079 36.259);
          
            --color-amber-50: oklch(98.7% 0.022 95.277);
            --color-amber-100: oklch(96.2% 0.059 95.617);
            --color-amber-200: oklch(92.4% 0.12 95.746);
            --color-amber-300: oklch(87.9% 0.169 91.605);
            --color-amber-400: oklch(82.8% 0.189 84.429);
            --color-amber-500: oklch(76.9% 0.188 70.08);
            --color-amber-600: oklch(66.6% 0.179 58.318);
            --color-amber-700: oklch(55.5% 0.163 48.998);
            --color-amber-800: oklch(47.3% 0.137 46.201);
            --color-amber-900: oklch(41.4% 0.112 45.904);
            --color-amber-950: oklch(27.9% 0.077 45.635);
          
            --color-yellow-50: oklch(98.7% 0.026 102.212);
            --color-yellow-100: oklch(97.3% 0.071 103.193);
            --color-yellow-200: oklch(94.5% 0.129 101.54);
            --color-yellow-300: oklch(90.5% 0.182 98.111);
            --color-yellow-400: oklch(85.2% 0.199 91.936);
            --color-yellow-500: oklch(79.5% 0.184 86.047);
            --color-yellow-600: oklch(68.1% 0.162 75.834);
            --color-yellow-700: oklch(55.4% 0.135 66.442);
            --color-yellow-800: oklch(47.6% 0.114 61.907);
            --color-yellow-900: oklch(42.1% 0.095 57.708);
            --color-yellow-950: oklch(28.6% 0.066 53.813);
          
            --color-lime-50: oklch(98.6% 0.031 120.757);
            --color-lime-100: oklch(96.7% 0.067 122.328);
            --color-lime-200: oklch(93.8% 0.127 124.321);
            --color-lime-300: oklch(89.7% 0.196 126.665);
            --color-lime-400: oklch(84.1% 0.238 128.85);
            --color-lime-500: oklch(76.8% 0.233 130.85);
            --color-lime-600: oklch(64.8% 0.2 131.684);
            --color-lime-700: oklch(53.2% 0.157 131.589);
            --color-lime-800: oklch(45.3% 0.124 130.933);
            --color-lime-900: oklch(40.5% 0.101 131.063);
            --color-lime-950: oklch(27.4% 0.072 132.109);
          
            --color-green-50: oklch(98.2% 0.018 155.826);
            --color-green-100: oklch(96.2% 0.044 156.743);
            --color-green-200: oklch(92.5% 0.084 155.995);
            --color-green-300: oklch(87.1% 0.15 154.449);
            --color-green-400: oklch(79.2% 0.209 151.711);
            --color-green-500: oklch(72.3% 0.219 149.579);
            --color-green-600: oklch(62.7% 0.194 149.214);
            --color-green-700: oklch(52.7% 0.154 150.069);
            --color-green-800: oklch(44.8% 0.119 151.328);
            --color-green-900: oklch(39.3% 0.095 152.535);
            --color-green-950: oklch(26.6% 0.065 152.934);
          
            --color-emerald-50: oklch(97.9% 0.021 166.113);
            --color-emerald-100: oklch(95% 0.052 163.051);
            --color-emerald-200: oklch(90.5% 0.093 164.15);
            --color-emerald-300: oklch(84.5% 0.143 164.978);
            --color-emerald-400: oklch(76.5% 0.177 163.223);
            --color-emerald-500: oklch(69.6% 0.17 162.48);
            --color-emerald-600: oklch(59.6% 0.145 163.225);
            --color-emerald-700: oklch(50.8% 0.118 165.612);
            --color-emerald-800: oklch(43.2% 0.095 166.913);
            --color-emerald-900: oklch(37.8% 0.077 168.94);
            --color-emerald-950: oklch(26.2% 0.051 172.552);
          
            --color-teal-50: oklch(98.4% 0.014 180.72);
            --color-teal-100: oklch(95.3% 0.051 180.801);
            --color-teal-200: oklch(91% 0.096 180.426);
            --color-teal-300: oklch(85.5% 0.138 181.071);
            --color-teal-400: oklch(77.7% 0.152 181.912);
            --color-teal-500: oklch(70.4% 0.14 182.503);
            --color-teal-600: oklch(60% 0.118 184.704);
            --color-teal-700: oklch(51.1% 0.096 186.391);
            --color-teal-800: oklch(43.7% 0.078 188.216);
            --color-teal-900: oklch(38.6% 0.063 188.416);
            --color-teal-950: oklch(27.7% 0.046 192.524);
          
            --color-cyan-50: oklch(98.4% 0.019 200.873);
            --color-cyan-100: oklch(95.6% 0.045 203.388);
            --color-cyan-200: oklch(91.7% 0.08 205.041);
            --color-cyan-300: oklch(86.5% 0.127 207.078);
            --color-cyan-400: oklch(78.9% 0.154 211.53);
            --color-cyan-500: oklch(71.5% 0.143 215.221);
            --color-cyan-600: oklch(60.9% 0.126 221.723);
            --color-cyan-700: oklch(52% 0.105 223.128);
            --color-cyan-800: oklch(45% 0.085 224.283);
            --color-cyan-900: oklch(39.8% 0.07 227.392);
            --color-cyan-950: oklch(30.2% 0.056 229.695);
          
            --color-sky-50: oklch(97.7% 0.013 236.62);
            --color-sky-100: oklch(95.1% 0.026 236.824);
            --color-sky-200: oklch(90.1% 0.058 230.902);
            --color-sky-300: oklch(82.8% 0.111 230.318);
            --color-sky-400: oklch(74.6% 0.16 232.661);
            --color-sky-500: oklch(68.5% 0.169 237.323);
            --color-sky-600: oklch(58.8% 0.158 241.966);
            --color-sky-700: oklch(50% 0.134 242.749);
            --color-sky-800: oklch(44.3% 0.11 240.79);
            --color-sky-900: oklch(39.1% 0.09 240.876);
            --color-sky-950: oklch(29.3% 0.066 243.157);
          
            --color-blue-50: oklch(97% 0.014 254.604);
            --color-blue-100: oklch(93.2% 0.032 255.585);
            --color-blue-200: oklch(88.2% 0.059 254.128);
            --color-blue-300: oklch(80.9% 0.105 251.813);
            --color-blue-400: oklch(70.7% 0.165 254.624);
            --color-blue-500: oklch(62.3% 0.214 259.815);
            --color-blue-600: oklch(54.6% 0.245 262.881);
            --color-blue-700: oklch(48.8% 0.243 264.376);
            --color-blue-800: oklch(42.4% 0.199 265.638);
            --color-blue-900: oklch(37.9% 0.146 265.522);
            --color-blue-950: oklch(28.2% 0.091 267.935);
          
            --color-indigo-50: oklch(96.2% 0.018 272.314);
            --color-indigo-100: oklch(93% 0.034 272.788);
            --color-indigo-200: oklch(87% 0.065 274.039);
            --color-indigo-300: oklch(78.5% 0.115 274.713);
            --color-indigo-400: oklch(67.3% 0.182 276.935);
            --color-indigo-500: oklch(58.5% 0.233 277.117);
            --color-indigo-600: oklch(51.1% 0.262 276.966);
            --color-indigo-700: oklch(45.7% 0.24 277.023);
            --color-indigo-800: oklch(39.8% 0.195 277.366);
            --color-indigo-900: oklch(35.9% 0.144 278.697);
            --color-indigo-950: oklch(25.7% 0.09 281.288);
          
            --color-violet-50: oklch(96.9% 0.016 293.756);
            --color-violet-100: oklch(94.3% 0.029 294.588);
            --color-violet-200: oklch(89.4% 0.057 293.283);
            --color-violet-300: oklch(81.1% 0.111 293.571);
            --color-violet-400: oklch(70.2% 0.183 293.541);
            --color-violet-500: oklch(60.6% 0.25 292.717);
            --color-violet-600: oklch(54.1% 0.281 293.009);
            --color-violet-700: oklch(49.1% 0.27 292.581);
            --color-violet-800: oklch(43.2% 0.232 292.759);
            --color-violet-900: oklch(38% 0.189 293.745);
            --color-violet-950: oklch(28.3% 0.141 291.089);
          
            --color-purple-50: oklch(97.7% 0.014 308.299);
            --color-purple-100: oklch(94.6% 0.033 307.174);
            --color-purple-200: oklch(90.2% 0.063 306.703);
            --color-purple-300: oklch(82.7% 0.119 306.383);
            --color-purple-400: oklch(71.4% 0.203 305.504);
            --color-purple-500: oklch(62.7% 0.265 303.9);
            --color-purple-600: oklch(55.8% 0.288 302.321);
            --color-purple-700: oklch(49.6% 0.265 301.924);
            --color-purple-800: oklch(43.8% 0.218 303.724);
            --color-purple-900: oklch(38.1% 0.176 304.987);
            --color-purple-950: oklch(29.1% 0.149 302.717);
          
            --color-fuchsia-50: oklch(97.7% 0.017 320.058);
            --color-fuchsia-100: oklch(95.2% 0.037 318.852);
            --color-fuchsia-200: oklch(90.3% 0.076 319.62);
            --color-fuchsia-300: oklch(83.3% 0.145 321.434);
            --color-fuchsia-400: oklch(74% 0.238 322.16);
            --color-fuchsia-500: oklch(66.7% 0.295 322.15);
            --color-fuchsia-600: oklch(59.1% 0.293 322.896);
            --color-fuchsia-700: oklch(51.8% 0.253 323.949);
            --color-fuchsia-800: oklch(45.2% 0.211 324.591);
            --color-fuchsia-900: oklch(40.1% 0.17 325.612);
            --color-fuchsia-950: oklch(29.3% 0.136 325.661);
          
            --color-pink-50: oklch(97.1% 0.014 343.198);
            --color-pink-100: oklch(94.8% 0.028 342.258);
            --color-pink-200: oklch(89.9% 0.061 343.231);
            --color-pink-300: oklch(82.3% 0.12 346.018);
            --color-pink-400: oklch(71.8% 0.202 349.761);
            --color-pink-500: oklch(65.6% 0.241 354.308);
            --color-pink-600: oklch(59.2% 0.249 0.584);
            --color-pink-700: oklch(52.5% 0.223 3.958);
            --color-pink-800: oklch(45.9% 0.187 3.815);
            --color-pink-900: oklch(40.8% 0.153 2.432);
            --color-pink-950: oklch(28.4% 0.109 3.907);
          
            --color-rose-50: oklch(96.9% 0.015 12.422);
            --color-rose-100: oklch(94.1% 0.03 12.58);
            --color-rose-200: oklch(89.2% 0.058 10.001);
            --color-rose-300: oklch(81% 0.117 11.638);
            --color-rose-400: oklch(71.2% 0.194 13.428);
            --color-rose-500: oklch(64.5% 0.246 16.439);
            --color-rose-600: oklch(58.6% 0.253 17.585);
            --color-rose-700: oklch(51.4% 0.222 16.935);
            --color-rose-800: oklch(45.5% 0.188 13.697);
            --color-rose-900: oklch(41% 0.159 10.272);
            --color-rose-950: oklch(27.1% 0.105 12.094);
          
            --color-slate-50: oklch(98.4% 0.003 247.858);
            --color-slate-100: oklch(96.8% 0.007 247.896);
            --color-slate-200: oklch(92.9% 0.013 255.508);
            --color-slate-300: oklch(86.9% 0.022 252.894);
            --color-slate-400: oklch(70.4% 0.04 256.788);
            --color-slate-500: oklch(55.4% 0.046 257.417);
            --color-slate-600: oklch(44.6% 0.043 257.281);
            --color-slate-700: oklch(37.2% 0.044 257.287);
            --color-slate-800: oklch(27.9% 0.041 260.031);
            --color-slate-900: oklch(20.8% 0.042 265.755);
            --color-slate-950: oklch(12.9% 0.042 264.695);
          
            --color-gray-50: oklch(98.5% 0.002 247.839);
            --color-gray-100: oklch(96.7% 0.003 264.542);
            --color-gray-200: oklch(92.8% 0.006 264.531);
            --color-gray-300: oklch(87.2% 0.01 258.338);
            --color-gray-400: oklch(70.7% 0.022 261.325);
            --color-gray-500: oklch(55.1% 0.027 264.364);
            --color-gray-600: oklch(44.6% 0.03 256.802);
            --color-gray-700: oklch(37.3% 0.034 259.733);
            --color-gray-800: oklch(27.8% 0.033 256.848);
            --color-gray-900: oklch(21% 0.034 264.665);
            --color-gray-950: oklch(13% 0.028 261.692);
          
            --color-zinc-50: oklch(98.5% 0 0);
            --color-zinc-100: oklch(96.7% 0.001 286.375);
            --color-zinc-200: oklch(92% 0.004 286.32);
            --color-zinc-300: oklch(87.1% 0.006 286.286);
            --color-zinc-400: oklch(70.5% 0.015 286.067);
            --color-zinc-500: oklch(55.2% 0.016 285.938);
            --color-zinc-600: oklch(44.2% 0.017 285.786);
            --color-zinc-700: oklch(37% 0.013 285.805);
            --color-zinc-800: oklch(27.4% 0.006 286.033);
            --color-zinc-900: oklch(21% 0.006 285.885);
            --color-zinc-950: oklch(14.1% 0.005 285.823);
          
            --color-neutral-50: oklch(98.5% 0 0);
            --color-neutral-100: oklch(97% 0 0);
            --color-neutral-200: oklch(92.2% 0 0);
            --color-neutral-300: oklch(87% 0 0);
            --color-neutral-400: oklch(70.8% 0 0);
            --color-neutral-500: oklch(55.6% 0 0);
            --color-neutral-600: oklch(43.9% 0 0);
            --color-neutral-700: oklch(37.1% 0 0);
            --color-neutral-800: oklch(26.9% 0 0);
            --color-neutral-900: oklch(20.5% 0 0);
            --color-neutral-950: oklch(14.5% 0 0);
          
            --color-stone-50: oklch(98.5% 0.001 106.423);
            --color-stone-100: oklch(97% 0.001 106.424);
            --color-stone-200: oklch(92.3% 0.003 48.717);
            --color-stone-300: oklch(86.9% 0.005 56.366);
            --color-stone-400: oklch(70.9% 0.01 56.259);
            --color-stone-500: oklch(55.3% 0.013 58.071);
            --color-stone-600: oklch(44.4% 0.011 73.639);
            --color-stone-700: oklch(37.4% 0.01 67.558);
            --color-stone-800: oklch(26.8% 0.007 34.298);
            --color-stone-900: oklch(21.6% 0.006 56.043);
            --color-stone-950: oklch(14.7% 0.004 49.25);
          
            --color-black: #000;
            --color-white: #fff;
          
            --spacing: 0.25rem;
          
            --breakpoint-sm: 40rem;
            --breakpoint-md: 48rem;
            --breakpoint-lg: 64rem;
            --breakpoint-xl: 80rem;
            --breakpoint-2xl: 96rem;
          
            --container-3xs: 16rem;
            --container-2xs: 18rem;
            --container-xs: 20rem;
            --container-sm: 24rem;
            --container-md: 28rem;
            --container-lg: 32rem;
            --container-xl: 36rem;
            --container-2xl: 42rem;
            --container-3xl: 48rem;
            --container-4xl: 56rem;
            --container-5xl: 64rem;
            --container-6xl: 72rem;
            --container-7xl: 80rem;
          
            --text-xs: 0.75rem;
            --text-xs--line-height: calc(1 / 0.75);
            --text-sm: 0.875rem;
            --text-sm--line-height: calc(1.25 / 0.875);
            --text-base: 1rem;
            --text-base--line-height: calc(1.5 / 1);
            --text-lg: 1.125rem;
            --text-lg--line-height: calc(1.75 / 1.125);
            --text-xl: 1.25rem;
            --text-xl--line-height: calc(1.75 / 1.25);
            --text-2xl: 1.5rem;
            --text-2xl--line-height: calc(2 / 1.5);
            --text-3xl: 1.875rem;
            --text-3xl--line-height: calc(2.25 / 1.875);
            --text-4xl: 2.25rem;
            --text-4xl--line-height: calc(2.5 / 2.25);
            --text-5xl: 3rem;
            --text-5xl--line-height: 1;
            --text-6xl: 3.75rem;
            --text-6xl--line-height: 1;
            --text-7xl: 4.5rem;
            --text-7xl--line-height: 1;
            --text-8xl: 6rem;
            --text-8xl--line-height: 1;
            --text-9xl: 8rem;
            --text-9xl--line-height: 1;
          
            --font-weight-thin: 100;
            --font-weight-extralight: 200;
            --font-weight-light: 300;
            --font-weight-normal: 400;
            --font-weight-medium: 500;
            --font-weight-semibold: 600;
            --font-weight-bold: 700;
            --font-weight-extrabold: 800;
            --font-weight-black: 900;
          
            --tracking-tighter: -0.05em;
            --tracking-tight: -0.025em;
            --tracking-normal: 0em;
            --tracking-wide: 0.025em;
            --tracking-wider: 0.05em;
            --tracking-widest: 0.1em;
          
            --leading-tight: 1.25;
            --leading-snug: 1.375;
            --leading-normal: 1.5;
            --leading-relaxed: 1.625;
            --leading-loose: 2;
          
            --radius-xs: 0.125rem;
            --radius-sm: 0.25rem;
            --radius-md: 0.375rem;
            --radius-lg: 0.5rem;
            --radius-xl: 0.75rem;
            --radius-2xl: 1rem;
            --radius-3xl: 1.5rem;
            --radius-4xl: 2rem;
          
            --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
            --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
          
            --inset-shadow-2xs: inset 0 1px rgb(0 0 0 / 0.05);
            --inset-shadow-xs: inset 0 1px 1px rgb(0 0 0 / 0.05);
            --inset-shadow-sm: inset 0 2px 4px rgb(0 0 0 / 0.05);
          
            --drop-shadow-xs: 0 1px 1px rgb(0 0 0 / 0.05);
            --drop-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.15);
            --drop-shadow-md: 0 3px 3px rgb(0 0 0 / 0.12);
            --drop-shadow-lg: 0 4px 4px rgb(0 0 0 / 0.15);
            --drop-shadow-xl: 0 9px 7px rgb(0 0 0 / 0.1);
            --drop-shadow-2xl: 0 25px 25px rgb(0 0 0 / 0.15);
          
            --text-shadow-2xs: 0px 1px 0px rgb(0 0 0 / 0.15);
            --text-shadow-xs: 0px 1px 1px rgb(0 0 0 / 0.2);
            --text-shadow-sm:
              0px 1px 0px rgb(0 0 0 / 0.075), 0px 1px 1px rgb(0 0 0 / 0.075), 0px 2px 2px rgb(0 0 0 / 0.075);
            --text-shadow-md:
              0px 1px 1px rgb(0 0 0 / 0.1), 0px 1px 2px rgb(0 0 0 / 0.1), 0px 2px 4px rgb(0 0 0 / 0.1);
            --text-shadow-lg:
              0px 1px 2px rgb(0 0 0 / 0.1), 0px 3px 2px rgb(0 0 0 / 0.1), 0px 4px 8px rgb(0 0 0 / 0.1);
          
            --ease-in: cubic-bezier(0.4, 0, 1, 1);
            --ease-out: cubic-bezier(0, 0, 0.2, 1);
            --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
          
            --animate-spin: spin 1s linear infinite;
            --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
            --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            --animate-bounce: bounce 1s infinite;
          
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          
            @keyframes ping {
              75%,
              100% {
                transform: scale(2);
                opacity: 0;
              }
            }
          
            @keyframes pulse {
              50% {
                opacity: 0.5;
              }
            }
          
            @keyframes bounce {
              0%,
              100% {
                transform: translateY(-25%);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
              }
          
              50% {
                transform: none;
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
              }
            }
          
            --blur-xs: 4px;
            --blur-sm: 8px;
            --blur-md: 12px;
            --blur-lg: 16px;
            --blur-xl: 24px;
            --blur-2xl: 40px;
            --blur-3xl: 64px;
          
            --perspective-dramatic: 100px;
            --perspective-near: 300px;
            --perspective-normal: 500px;
            --perspective-midrange: 800px;
            --perspective-distant: 1200px;
          
            --aspect-video: 16 / 9;
          
            --default-transition-duration: 150ms;
            --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            --default-font-family: --theme(--font-sans, initial);
    #8      ----------------------------------------------------
            --default-font-feature-settings: --theme(--font-sans--font-feature-settings, initial);
            --default-font-variation-settings: --theme(--font-sans--font-variation-settings, initial);
            --default-mono-font-family: --theme(--font-mono, initial);
    #9      ---------------------------------------------------------
            --default-mono-font-feature-settings: --theme(--font-mono--font-feature-settings, initial);
            --default-mono-font-variation-settings: --theme(--font-mono--font-variation-settings, initial);
          }
          
          /* Deprecated */
          @theme default inline reference {
            --blur: 8px;
            --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
            --drop-shadow: 0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06);
            --radius: 0.25rem;
            --max-width-prose: 65ch;
          }
          
          /* input: preflight.css */
          /*
            1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
            2. Remove default margins and padding
            3. Reset all borders.
          */
          
          *,
    #11   ^
          ::after,
    #11   ^
          ::before,
    #12   ^
          ::backdrop,
    #12   ^
          ::file-selector-button {
    #13   -----------------------
            box-sizing: border-box; /* 1 */
    #14     ----------------------
            margin: 0; /* 2 */
    #15     ---------
            padding: 0; /* 2 */
    #16     ----------
            border: 0 solid; /* 3 */
    #17     ---------------
          }
          
          /*
            1. Use a consistent sensible line-height in all browsers.
            2. Prevent adjustments of font size after orientation changes in iOS.
            3. Use a more readable tab size.
            4. Use the user's configured \`sans\` font-family by default.
            5. Use the user's configured \`sans\` font-feature-settings by default.
            6. Use the user's configured \`sans\` font-variation-settings by default.
            7. Disable tap highlights on iOS.
          */
          
          html,
    #18   ^
          :host {
    #18   ------
            line-height: 1.5; /* 1 */
    #19     ----------------
            -webkit-text-size-adjust: 100%; /* 2 */
    #20     ------------------------------
            tab-size: 4; /* 3 */
    #21     -----------
            font-family: --theme(
    #22     ^
              --default-font-family,
    #23   ^
              ui-sans-serif,
    #23   ^
              system-ui,
    #24   ^
              sans-serif,
    #24   ^
              'Apple Color Emoji',
    #25   ^
              'Segoe UI Emoji',
    #25   ^
              'Segoe UI Symbol',
    #26   ^
              'Noto Color Emoji'
    #26   ^
            ); /* 4 */
    #27   ---
            font-feature-settings: --theme(--default-font-feature-settings, normal); /* 5 */
    #28     -----------------------------------------------------------------------
            font-variation-settings: --theme(--default-font-variation-settings, normal); /* 6 */
    #29     ---------------------------------------------------------------------------
            -webkit-tap-highlight-color: transparent; /* 7 */
    #30     ----------------------------------------
          }
          
          /*
            1. Add the correct height in Firefox.
            2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
            3. Reset the default border style to a 1px solid border.
          */
          
          hr {
    #31   ---
            height: 0; /* 1 */
    #32     ---------
            color: inherit; /* 2 */
    #33     --------------
            border-top-width: 1px; /* 3 */
    #34     ---------------------
          }
          
          /*
            Add the correct text decoration in Chrome, Edge, and Safari.
          */
          
          abbr:where([title]) {
    #35   --------------------
            -webkit-text-decoration: underline dotted;
    #36     -----------------------------------------
            text-decoration: underline dotted;
    #37     ---------------------------------
          }
          
          /*
            Remove the default font size and weight for headings.
          */
          
          h1,
    #38   ^
          h2,
    #38   ^
          h3,
    #39   ^
          h4,
    #39   ^
          h5,
    #40   ^
          h6 {
    #40   ---
            font-size: inherit;
    #41     ------------------
            font-weight: inherit;
    #42     --------------------
          }
          
          /*
            Reset links to optimize for opt-in styling instead of opt-out.
          */
          
          a {
    #43   --
            color: inherit;
    #44     --------------
            -webkit-text-decoration: inherit;
    #45     --------------------------------
            text-decoration: inherit;
    #46     ------------------------
          }
          
          /*
            Add the correct font weight in Edge and Safari.
          */
          
          b,
    #47   ^
          strong {
    #48   -------
            font-weight: bolder;
    #49     -------------------
          }
          
          /*
            1. Use the user's configured \`mono\` font-family by default.
            2. Use the user's configured \`mono\` font-feature-settings by default.
            3. Use the user's configured \`mono\` font-variation-settings by default.
            4. Correct the odd \`em\` font sizing in all browsers.
          */
          
          code,
    #50   ^
          kbd,
    #50   ^
          samp,
    #51   ^
          pre {
    #51   ----
            font-family: --theme(
    #52     ^
              --default-mono-font-family,
    #53   ^
              ui-monospace,
    #53   ^
              SFMono-Regular,
    #54   ^
              Menlo,
    #54   ^
              Monaco,
    #55   ^
              Consolas,
    #55   ^
              'Liberation Mono',
    #56   ^
              'Courier New',
    #56   ^
              monospace
    #57   ^
            ); /* 1 */
    #57   ---
            font-feature-settings: --theme(--default-mono-font-feature-settings, normal); /* 2 */
    #58     ----------------------------------------------------------------------------
            font-variation-settings: --theme(--default-mono-font-variation-settings, normal); /* 3 */
    #59     --------------------------------------------------------------------------------
            font-size: 1em; /* 4 */
    #60     --------------
          }
          
          /*
            Add the correct font size in all browsers.
          */
          
          small {
    #61   ------
            font-size: 80%;
    #62     --------------
          }
          
          /*
            Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
          */
          
          sub,
    #63   ^
          sup {
    #64   ----
            font-size: 75%;
    #65     --------------
            line-height: 0;
    #66     --------------
            position: relative;
    #67     ------------------
            vertical-align: baseline;
    #68     ------------------------
          }
          
          sub {
    #69   ----
            bottom: -0.25em;
    #70     ---------------
          }
          
          sup {
    #71   ----
            top: -0.5em;
    #72     -----------
          }
          
          /*
            1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
            2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
            3. Remove gaps between table borders by default.
          */
          
          table {
    #73   ------
            text-indent: 0; /* 1 */
    #74     --------------
            border-color: inherit; /* 2 */
    #75     ---------------------
            border-collapse: collapse; /* 3 */
    #76     -------------------------
          }
          
          /*
            Use the modern Firefox focus style for all focusable elements.
          */
          
          :-moz-focusring {
    #77   ----------------
            outline: auto;
    #78     -------------
          }
          
          /*
            Add the correct vertical alignment in Chrome and Firefox.
          */
          
          progress {
    #79   ---------
            vertical-align: baseline;
    #80     ------------------------
          }
          
          /*
            Add the correct display in Chrome and Safari.
          */
          
          summary {
    #81   --------
            display: list-item;
    #82     ------------------
          }
          
          /*
            Make lists unstyled by default.
          */
          
          ol,
    #83   ^
          ul,
    #83   ^
          menu {
    #84   -----
            list-style: none;
    #85     ----------------
          }
          
          /*
            1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
            2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
                This can trigger a poorly considered lint error in some tools but is included by design.
          */
          
          img,
    #86   ^
          svg,
    #86   ^
          video,
    #87   ^
          canvas,
    #87   ^
          audio,
    #88   ^
          iframe,
    #88   ^
          embed,
    #89   ^
          object {
    #89   -------
            display: block; /* 1 */
    #90     --------------
            vertical-align: middle; /* 2 */
    #91     ----------------------
          }
          
          /*
            Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
          */
          
          img,
    #92   ^
          video {
    #93   ------
            max-width: 100%;
    #94     ---------------
            height: auto;
    #95     ------------
          }
          
          /*
            1. Inherit font styles in all browsers.
            2. Remove border radius in all browsers.
            3. Remove background color in all browsers.
            4. Ensure consistent opacity for disabled states in all browsers.
          */
          
          button,
    #96   ^
          input,
    #96   ^
          select,
    #97   ^
          optgroup,
    #97   ^
          textarea,
    #98   ^
          ::file-selector-button {
    #98   -----------------------
            font: inherit; /* 1 */
    #99     -------------
            font-feature-settings: inherit; /* 1 */
    #100    ------------------------------
            font-variation-settings: inherit; /* 1 */
    #101    --------------------------------
            letter-spacing: inherit; /* 1 */
    #102    -----------------------
            color: inherit; /* 1 */
    #103    --------------
            border-radius: 0; /* 2 */
    #104    ----------------
            background-color: transparent; /* 3 */
    #105    -----------------------------
            opacity: 1; /* 4 */
    #106    ----------
          }
          
          /*
            Restore default font weight.
          */
          
          :where(select:is([multiple], [size])) optgroup {
    #107  -----------------------------------------------
            font-weight: bolder;
    #108    -------------------
          }
          
          /*
            Restore indentation.
          */
          
          :where(select:is([multiple], [size])) optgroup option {
    #109  ------------------------------------------------------
            padding-inline-start: 20px;
    #110    --------------------------
          }
          
          /*
            Restore space after button.
          */
          
          ::file-selector-button {
    #111  -----------------------
            margin-inline-end: 4px;
    #112    ----------------------
          }
          
          /*
            Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
          */
          
          ::placeholder {
    #113  --------------
            opacity: 1;
    #114    ----------
          }
          
          /*
            Set the default placeholder color to a semi-transparent version of the current text color in browsers that do not
            crash when using \`color-mix(…)\` with \`currentcolor\`. (https://github.com/tailwindlabs/tailwindcss/issues/17194)
          */
          
          @supports (not (-webkit-appearance: -apple-pay-button)) /* Not Safari */ or
    #115  ^
            (contain-intrinsic-size: 1px) /* Safari 17+ */ {
    #116  -------------------------------------------------
            ::placeholder {
    #117    --------------
              color: color-mix(in oklab, currentcolor 50%, transparent);
    #118      ---------------------------------------------------------
    #119      ---------------------------------------------------------
    #120      ---------------------------------------------------------
            }
          }
          
          /*
            Prevent resizing textareas horizontally by default.
          */
          
          textarea {
    #121  ---------
            resize: vertical;
    #122    ----------------
          }
          
          /*
            Remove the inner padding in Chrome and Safari on macOS.
          */
          
          ::-webkit-search-decoration {
    #123  ----------------------------
            -webkit-appearance: none;
    #124    ------------------------
          }
          
          /*
            1. Ensure date/time inputs have the same height when empty in iOS Safari.
            2. Ensure text alignment can be changed on date/time inputs in iOS Safari.
          */
          
          ::-webkit-date-and-time-value {
    #125  ------------------------------
            min-height: 1lh; /* 1 */
    #126    ---------------
            text-align: inherit; /* 2 */
    #127    -------------------
          }
          
          /*
            Prevent height from changing on date/time inputs in macOS Safari when the input is set to \`display: block\`.
          */
          
          ::-webkit-datetime-edit {
    #128  ------------------------
            display: inline-flex;
    #129    --------------------
          }
          
          /*
            Remove excess padding from pseudo-elements in date/time inputs to ensure consistent height across browsers.
          */
          
          ::-webkit-datetime-edit-fields-wrapper {
    #130  ---------------------------------------
            padding: 0;
    #131    ----------
          }
          
          ::-webkit-datetime-edit,
    #132  ^
          ::-webkit-datetime-edit-year-field,
    #132  ^
          ::-webkit-datetime-edit-month-field,
    #133  ^
          ::-webkit-datetime-edit-day-field,
    #133  ^
          ::-webkit-datetime-edit-hour-field,
    #134  ^
          ::-webkit-datetime-edit-minute-field,
    #134  ^
          ::-webkit-datetime-edit-second-field,
    #135  ^
          ::-webkit-datetime-edit-millisecond-field,
    #135  ^
          ::-webkit-datetime-edit-meridiem-field {
    #136  ---------------------------------------
            padding-block: 0;
    #137    ----------------
          }
          
          /*
            Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
          */
          
          :-moz-ui-invalid {
    #138  -----------------
            box-shadow: none;
    #139    ----------------
          }
          
          /*
            Correct the inability to style the border radius in iOS Safari.
          */
          
          button,
    #140  ^
          input:where([type='button'], [type='reset'], [type='submit']),
    #140  ^
          ::file-selector-button {
    #141  -----------------------
            appearance: button;
    #142    ------------------
          }
          
          /*
            Correct the cursor style of increment and decrement buttons in Safari.
          */
          
          ::-webkit-inner-spin-button,
    #143  ^
          ::-webkit-outer-spin-button {
    #143  ----------------------------
            height: auto;
    #144    ------------
          }
          
          /*
            Make elements with the HTML hidden attribute stay hidden by default.
          */
          
          [hidden]:where(:not([hidden='until-found'])) {
    #145  ---------------------------------------------
            display: none !important;
    #146    ------------------------
          }
          
          /* input: input.css */
          @import 'tailwindcss';
          
          .foo {
    #148  -----
            @apply underline;
    #149           ---------
          }
          /* output */
          @layer theme, base, components, utilities;
    #1    -----------------------------------------
          @layer theme {
    #2    -------------
            :root, :host {
    #3      -------------
              --font-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    #4        
    #5        ^
              'Noto Color Emoji';
    #5                          ^
              --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    #6        
    #7        ^
              monospace;
    #7                 ^
              --default-font-family: var(--font-sans);
    #8        ---------------------------------------
              --default-mono-font-family: var(--font-mono);
    #9        --------------------------------------------
            }
          }
          @layer base {
    #10   ------------
            *, ::after, ::before, ::backdrop, ::file-selector-button {
    #11     
    #12     
    #13     ---------------------------------------------------------
              box-sizing: border-box;
    #14       ----------------------
              margin: 0;
    #15       ---------
              padding: 0;
    #16       ----------
              border: 0 solid;
    #17       ---------------
            }
            html, :host {
    #18     
    #19                 ^
              line-height: 1.5;
    #19       ----------------
              -webkit-text-size-adjust: 100%;
    #20       ------------------------------
              tab-size: 4;
    #21       -----------
              font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji');
    #22       
    #23       
    #24       
    #25       
    #26       
    #27                                                                                                                                                                  ^
              font-feature-settings: var(--default-font-feature-settings, normal);
    #28       -------------------------------------------------------------------
              font-variation-settings: var(--default-font-variation-settings, normal);
    #29       -----------------------------------------------------------------------
              -webkit-tap-highlight-color: transparent;
    #30       ----------------------------------------
            }
            hr {
    #31     ---
              height: 0;
    #32       ---------
              color: inherit;
    #33       --------------
              border-top-width: 1px;
    #34       ---------------------
            }
            abbr:where([title]) {
    #35     --------------------
              -webkit-text-decoration: underline dotted;
    #36       -----------------------------------------
              text-decoration: underline dotted;
    #37       ---------------------------------
            }
            h1, h2, h3, h4, h5, h6 {
    #38     
    #39     
    #40     
    #41                            ^
              font-size: inherit;
    #41       ------------------
              font-weight: inherit;
    #42       --------------------
            }
            a {
    #43     --
              color: inherit;
    #44       --------------
              -webkit-text-decoration: inherit;
    #45       --------------------------------
              text-decoration: inherit;
    #46       ------------------------
            }
            b, strong {
    #47     
    #48               ^
              font-weight: bolder;
    #49       -------------------
            }
            code, kbd, samp, pre {
    #50     
    #51     
    #52                          ^
              font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace);
    #52       
    #53       
    #54       
    #55       
    #56       
    #57       ------------------------------------------------------------------------------------------------------------------------------------------------
              font-feature-settings: var(--default-mono-font-feature-settings, normal);
    #58       ------------------------------------------------------------------------
              font-variation-settings: var(--default-mono-font-variation-settings, normal);
    #59       ----------------------------------------------------------------------------
              font-size: 1em;
    #60       --------------
            }
            small {
    #61     ------
              font-size: 80%;
    #62       --------------
            }
            sub, sup {
    #63     
    #64              ^
              font-size: 75%;
    #65       --------------
              line-height: 0;
    #66       --------------
              position: relative;
    #67       ------------------
              vertical-align: baseline;
    #68       ------------------------
            }
            sub {
    #69     ----
              bottom: -0.25em;
    #70       ---------------
            }
            sup {
    #71     ----
              top: -0.5em;
    #72       -----------
            }
            table {
    #73     ------
              text-indent: 0;
    #74       --------------
              border-color: inherit;
    #75       ---------------------
              border-collapse: collapse;
    #76       -------------------------
            }
            :-moz-focusring {
    #77     ----------------
              outline: auto;
    #78       -------------
            }
            progress {
    #79     ---------
              vertical-align: baseline;
    #80       ------------------------
            }
            summary {
    #81     --------
              display: list-item;
    #82       ------------------
            }
            ol, ul, menu {
    #83     
    #84     -------------
              list-style: none;
    #85       ----------------
            }
            img, svg, video, canvas, audio, iframe, embed, object {
    #86     
    #87     
    #88     
    #89     
    #90                                                           ^
              display: block;
    #90       --------------
              vertical-align: middle;
    #91       ----------------------
            }
            img, video {
    #92     
    #93                ^
              max-width: 100%;
    #94       ---------------
              height: auto;
    #95       ------------
            }
            button, input, select, optgroup, textarea, ::file-selector-button {
    #96     
    #97     
    #98     
    #99                                                                       ^
              font: inherit;
    #99       -------------
              font-feature-settings: inherit;
    #100      ------------------------------
              font-variation-settings: inherit;
    #101      --------------------------------
              letter-spacing: inherit;
    #102      -----------------------
              color: inherit;
    #103      --------------
              border-radius: 0;
    #104      ----------------
              background-color: transparent;
    #105      -----------------------------
              opacity: 1;
    #106      ----------
            }
            :where(select:is([multiple], [size])) optgroup {
    #107    -----------------------------------------------
              font-weight: bolder;
    #108      -------------------
            }
            :where(select:is([multiple], [size])) optgroup option {
    #109    ------------------------------------------------------
              padding-inline-start: 20px;
    #110      --------------------------
            }
            ::file-selector-button {
    #111    -----------------------
              margin-inline-end: 4px;
    #112      ----------------------
            }
            ::placeholder {
    #113    --------------
              opacity: 1;
    #114      ----------
            }
            @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {
    #115    
    #116                                                                                              ^
              ::placeholder {
    #117      --------------
                color: currentcolor;
    #118        -------------------
                @supports (color: color-mix(in lab, red, red)) {
    #119        -----------------------------------------------
                  color: color-mix(in oklab, currentcolor 50%, transparent);
    #120          ---------------------------------------------------------
                }
              }
            }
            textarea {
    #121    ---------
              resize: vertical;
    #122      ----------------
            }
            ::-webkit-search-decoration {
    #123    ----------------------------
              -webkit-appearance: none;
    #124      ------------------------
            }
            ::-webkit-date-and-time-value {
    #125    ------------------------------
              min-height: 1lh;
    #126      ---------------
              text-align: inherit;
    #127      -------------------
            }
            ::-webkit-datetime-edit {
    #128    ------------------------
              display: inline-flex;
    #129      --------------------
            }
            ::-webkit-datetime-edit-fields-wrapper {
    #130    ---------------------------------------
              padding: 0;
    #131      ----------
            }
            ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
    #132    
    #133    
    #134    
    #135    
    #136    ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
              padding-block: 0;
    #137      ----------------
            }
            :-moz-ui-invalid {
    #138    -----------------
              box-shadow: none;
    #139      ----------------
            }
            button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-button {
    #140    
    #141    ----------------------------------------------------------------------------------------------
              appearance: button;
    #142      ------------------
            }
            ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    #143    
    #144                                                             ^
              height: auto;
    #144      ------------
            }
            [hidden]:where(:not([hidden='until-found'])) {
    #145    ---------------------------------------------
              display: none !important;
    #146      ------------------------
            }
          }
          @layer utilities;
    #147  ----------------
          .foo {
    #148  -----
            text-decoration-line: underline;
    #149    -------------------------------
          }
          
    "
  `)
})

test('source maps are generated for utilities', async () => {
  let visualized = await run({
    input: css`
      @import './utilities.css';
      @plugin "./plugin.js";
      @utility custom {
        color: orange;
      }
    `,
    candidates: ['custom', 'custom-js', 'flex'],
    options: {
      loadModule: async (_, base) => ({
        path: '',
        base,
        module: createPlugin(({ addUtilities }) => {
          addUtilities({ '.custom-js': { color: 'blue' } })
        }),
      }),
    },
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - utilities.css
    - input.css

    VISUALIZATION
         /* input: utilities.css */
         @tailwind utilities;
    #1   -------------------
    #2   -------------------
    #3   -------------------
    #5   -------------------
    #6   -------------------

         /* input: input.css */
         @import './utilities.css';
         @plugin "./plugin.js";
         @utility custom {
           color: orange;
    #4     -------------
         }
         /* output */
         .flex {
    #1   ------
           display: flex;
    #2     -------------
         }
         .custom {
    #3   --------
           color: orange;
    #4     -------------
         }
         .custom-js {
    #5   -----------
           color: blue;
    #6     -----------
         }

    "
  `)
})

test('utilities have source maps pointing to the utilities node', async () => {
  let visualized = await run({
    input: `@tailwind utilities;`,
    candidates: [
      //
      'underline',
    ],
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        @tailwind utilities;
    #1  -------------------
    #2  -------------------
        /* output */
        .underline {
    #1  -----------
          text-decoration-line: underline;
    #2    -------------------------------
        }

    "
  `)
})

test('@apply generates source maps', async () => {
  let visualized = await run({
    input: css`
      .foo {
        color: blue;
        @apply text-[#000] hover:text-[#f00];
        @apply underline;
        color: red;
      }
    `,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
         /* input: input.css */
         .foo {
    #1   -----
           color: blue;
    #2     -----------
           @apply text-[#000] hover:text-[#f00];
    #3            -----------
    #4                        -----------------
    #5                        -----------------
    #6                        -----------------
           @apply underline;
    #7            ---------
           color: red;
    #8     ----------
         }
         /* output */
         .foo {
    #1   -----
           color: blue;
    #2     -----------
           color: #000;
    #3     -----------
           &:hover {
    #4     --------
             @media (hover: hover) {
    #5       ----------------------
               color: #f00;
    #6         -----------
             }
           }
           text-decoration-line: underline;
    #7     -------------------------------
           color: red;
    #8     ----------
         }

    "
  `)
})

test('license comments preserve source locations', async () => {
  let visualized = await run({
    input: `/*! some comment */`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        /*! some comment */
    #1  -------------------
        /* output */
        /*! some comment */
    #1  -------------------
    "
  `)
})

test('license comments with new lines preserve source locations', async () => {
  let visualized = await run({
    input: `/*! some \n comment */`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        /*! some 
    #1  ^
         comment */
    #1  -----------
        /* output */
        /*! some 
    #1  
         comment */
    #2             ^
    "
  `)
})

test('comment, single line', async () => {
  let visualized = await analyze({
    input: `/*! foo */`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        /*! foo */
    #1  ----------
        /* output */
        /*! foo */
    #1  ----------
        
    "
  `)
})

test('comment, multi line', async () => {
  let visualized = await analyze({
    input: `/*! foo \n bar */`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        /*! foo 
    #1  ^
         bar */
    #1  -------
        /* output */
        /*! foo 
    #1  
         bar */
    #2         ^
        
    "
  `)
})

test('declaration, normal property, single line', async () => {
  let visualized = await analyze({
    input: `.foo { color: red; }`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        .foo { color: red; }
    #1  -----
    #2         ----------
        /* output */
        .foo {
    #1  -----
          color: red;
    #2    ----------
        }

    "
  `)
})

test('declaration, normal property, multi line', async () => {
  // Works, no changes needed
  let visualized = await analyze({
    input: dedent`
      .foo {
        grid-template-areas:
          "a b c"
          "d e f"
          "g h i";
      }
    `,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        .foo {
    #1  -----
          grid-template-areas:
    #2    ^
            "a b c"
    #2  ^
            "d e f"
    #3  ^
            "g h i";
    #3  -----------
        }
        /* output */
        .foo {
    #1  -----
          grid-template-areas: "a b c" "d e f" "g h i";
    #2    
    #3    
    #4                                                ^
        }
        
    "
  `)
})

test('declaration, custom property, single line', async () => {
  let visualized = await analyze({
    input: `.foo { --foo: bar; }`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        .foo { --foo: bar; }
    #1  -----
    #2         ----------
        /* output */
        .foo {
    #1  -----
          --foo: bar;
    #2    ----------
        }

    "
  `)
})

test('declaration, custom property, multi line', async () => {
  let visualized = await analyze({
    input: dedent`
      .foo {
        --foo: bar\nbaz;
      }
    `,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        .foo {
    #1  -----
          --foo: bar
    #2    ^
        baz;
    #2  ---
        }
        /* output */
        .foo {
    #1  -----
          --foo: bar
    #2    
        baz;
    #3     ^
        }
        
    "
  `)
})

test('at rules, bodyless, single line', async () => {
  // This intentionally has extra spaces
  let visualized = await analyze({
    input: `@layer foo,     bar;`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        @layer foo,     bar;
    #1  -------------------
        /* output */
        @layer foo, bar;
    #1  ---------------
        
    "
  `)
})

test('at rules, bodyless, multi line', async () => {
  let visualized = await analyze({
    input: dedent`
      @layer
        foo,
        bar
      ;
    `,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        @layer
    #1  ^
          foo,
    #1  ^
          bar
    #2  ^
        ;
    #2  ^
        /* output */
        @layer foo, bar;
    #1  
    #2  ---------------
        
    "
  `)
})

test('at rules, body, single line', async () => {
  let visualized = await analyze({
    input: `@layer foo { color: red; }`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        @layer foo { color: red; }
    #1  -----------
    #2               ----------
        /* output */
        @layer foo {
    #1  -----------
          color: red;
    #2    ----------
        }

    "
  `)
})

test('at rules, body, multi line', async () => {
  let visualized = await analyze({
    input: dedent`
      @layer
        foo
      {
        color: baz;
      }
    `,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        @layer
    #1  ^
          foo
    #1  ^
        {
    #2  ^
          color: baz;
    #2    ----------
        }
        /* output */
        @layer foo {
    #1  
    #2             ^
          color: baz;
    #2    ----------
        }
        
    "
  `)
})

test('style rules, body, single line', async () => {
  let visualized = await analyze({
    input: `.foo:is(.bar) { color: red; }`,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        .foo:is(.bar) { color: red; }
    #1  --------------
    #2                  ----------
        /* output */
        .foo:is(.bar) {
    #1  --------------
          color: red;
    #2    ----------
        }

    "
  `)
})

test('style rules, body, multi line', async () => {
  // Works, no changes needed
  let visualized = await analyze({
    input: dedent`
      .foo:is(
        .bar
      ) {
        color: red;
      }
    `,
  })

  expect(visualized).toMatchInlineSnapshot(`
    "
    SOURCES
    - input.css

    VISUALIZATION
        /* input: input.css */
        .foo:is(
    #1  ^
          .bar
    #1  ^
        ) {
    #2  --
          color: red;
    #3    ----------
        }
        /* output */
        .foo:is( .bar ) {
    #1  
    #2  ----------------
          color: red;
    #3    ----------
        }
        
    "
  `)
})
