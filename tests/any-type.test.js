import { run, html, css } from './util/run'

// Hi there, so you are debugging this test because something failed... right? Well we can look into
// the future and guessed that this would happen. So basically it means that we (it was probably
// you, silly) introduced a new plugin that conflicts with an existing plugin that has (either
// implicit or explicit) an `any` type.
//
// Now it is your job to decide which one should win, and mark that one with
// ```diff
// - 'any'
// + ['any', { preferOnConflict: true }]
// ```
// in the corePlugins.js file.
//
// You probably want to let the original one win for backwards compatible reasons.
//
// Good luck!
test('any types are set on correct plugins', () => {
  let config = {
    content: [
      {
        raw: html`
          <div class="inset-[var(--any-value)]"></div>
          <div class="inset-x-[var(--any-value)]"></div>
          <div class="inset-y-[var(--any-value)]"></div>
          <div class="top-[var(--any-value)]"></div>
          <div class="right-[var(--any-value)]"></div>
          <div class="bottom-[var(--any-value)]"></div>
          <div class="left-[var(--any-value)]"></div>
          <div class="z-[var(--any-value)]"></div>
          <div class="order-[var(--any-value)]"></div>
          <div class="col-[var(--any-value)]"></div>
          <div class="col-start-[var(--any-value)]"></div>
          <div class="col-end-[var(--any-value)]"></div>
          <div class="row-[var(--any-value)]"></div>
          <div class="row-start-[var(--any-value)]"></div>
          <div class="row-end-[var(--any-value)]"></div>
          <div class="m-[var(--any-value)]"></div>
          <div class="mx-[var(--any-value)]"></div>
          <div class="my-[var(--any-value)]"></div>
          <div class="mt-[var(--any-value)]"></div>
          <div class="mr-[var(--any-value)]"></div>
          <div class="mb-[var(--any-value)]"></div>
          <div class="ml-[var(--any-value)]"></div>
          <div class="aspect-[var(--any-value)]"></div>
          <div class="h-[var(--any-value)]"></div>
          <div class="max-h-[var(--any-value)]"></div>
          <div class="min-h-[var(--any-value)]"></div>
          <div class="w-[var(--any-value)]"></div>
          <div class="max-w-[var(--any-value)]"></div>
          <div class="min-w-[var(--any-value)]"></div>
          <div class="flex-[var(--any-value)]"></div>
          <div class="flex-shrink-[var(--any-value)]"></div>
          <div class="shrink-[var(--any-value)]"></div>
          <div class="flex-grow-[var(--any-value)]"></div>
          <div class="grow-[var(--any-value)]"></div>
          <div class="basis-[var(--any-value)]"></div>
          <div class="border-spacing-[var(--any-value)]"></div>
          <div class="border-spacing-x-[var(--any-value)]"></div>
          <div class="border-spacing-y-[var(--any-value)]"></div>
          <div class="origin-[var(--any-value)]"></div>
          <div class="translate-x-[var(--any-value)]"></div>
          <div class="translate-y-[var(--any-value)]"></div>
          <div class="rotate-[var(--any-value)]"></div>
          <div class="skew-[var(--any-value)]"></div>
          <div class="scale-[var(--any-value)]"></div>
          <div class="scale-x-[var(--any-value)]"></div>
          <div class="scale-y-[var(--any-value)]"></div>
          <div class="animate-[var(--any-value)]"></div>
          <div class="cursor-[var(--any-value)]"></div>
          <div class="scroll-m-[var(--any-value)]"></div>
          <div class="scroll-mx-[var(--any-value)]"></div>
          <div class="scroll-my-[var(--any-value)]"></div>
          <div class="scroll-mt-[var(--any-value)]"></div>
          <div class="scroll-mr-[var(--any-value)]"></div>
          <div class="scroll-mb-[var(--any-value)]"></div>
          <div class="scroll-ml-[var(--any-value)]"></div>
          <div class="scroll-p-[var(--any-value)]"></div>
          <div class="scroll-px-[var(--any-value)]"></div>
          <div class="scroll-py-[var(--any-value)]"></div>
          <div class="scroll-pt-[var(--any-value)]"></div>
          <div class="scroll-pr-[var(--any-value)]"></div>
          <div class="scroll-pb-[var(--any-value)]"></div>
          <div class="scroll-pl-[var(--any-value)]"></div>
          <div class="list-[var(--any-value)]"></div>
          <div class="columns-[var(--any-value)]"></div>
          <div class="auto-cols-[var(--any-value)]"></div>
          <div class="auto-rows-[var(--any-value)]"></div>
          <div class="grid-cols-[var(--any-value)]"></div>
          <div class="grid-rows-[var(--any-value)]"></div>
          <div class="gap-[var(--any-value)]"></div>
          <div class="gap-x-[var(--any-value)]"></div>
          <div class="gap-y-[var(--any-value)]"></div>
          <div class="space-x-[var(--any-value)]"></div>
          <div class="space-y-[var(--any-value)]"></div>
          <div class="divide-[var(--any-value)]"></div>
          <div class="divide-y-[var(--any-value)]"></div>
          <div class="divide-y-[var(--any-value)]"></div>
          <div class="divide-opacity-[var(--any-value)]"></div>
          <div class="rounded-[var(--any-value)]"></div>
          <div class="rounded-t-[var(--any-value)]"></div>
          <div class="rounded-r-[var(--any-value)]"></div>
          <div class="rounded-b-[var(--any-value)]"></div>
          <div class="rounded-l-[var(--any-value)]"></div>
          <div class="rounded-tl-[var(--any-value)]"></div>
          <div class="rounded-tr-[var(--any-value)]"></div>
          <div class="rounded-br-[var(--any-value)]"></div>
          <div class="rounded-bl-[var(--any-value)]"></div>
          <div class="border-[var(--any-value)]"></div>
          <div class="border-x-[var(--any-value)]"></div>
          <div class="border-y-[var(--any-value)]"></div>
          <div class="border-t-[var(--any-value)]"></div>
          <div class="border-r-[var(--any-value)]"></div>
          <div class="border-b-[var(--any-value)]"></div>
          <div class="border-l-[var(--any-value)]"></div>
          <div class="border-opacity-[var(--any-value)]"></div>
          <div class="bg-[var(--any-value)]"></div>
          <div class="bg-opacity-[var(--any-value)]"></div>
          <div class="from-[var(--any-value)]"></div>
          <div class="via-[var(--any-value)]"></div>
          <div class="to-[var(--any-value)]"></div>
          <div class="fill-[var(--any-value)]"></div>
          <div class="stroke-[var(--any-value)]"></div>
          <div class="object-[var(--any-value)]"></div>
          <div class="p-[var(--any-value)]"></div>
          <div class="px-[var(--any-value)]"></div>
          <div class="py-[var(--any-value)]"></div>
          <div class="pt-[var(--any-value)]"></div>
          <div class="pr-[var(--any-value)]"></div>
          <div class="pb-[var(--any-value)]"></div>
          <div class="pl-[var(--any-value)]"></div>
          <div class="indent-[var(--any-value)]"></div>
          <div class="align-[var(--any-value)]"></div>
          <div class="text-[var(--any-value)]"></div>
          <div class="font-[var(--any-value)]"></div>
          <div class="leading-[var(--any-value)]"></div>
          <div class="tracking-[var(--any-value)]"></div>
          <div class="text-opacity-[var(--any-value)]"></div>
          <div class="decoration-[var(--any-value)]"></div>
          <div class="underline-offset-[var(--any-value)]"></div>
          <div class="placeholder-[var(--any-value)]"></div>
          <div class="placeholder-opacity-[var(--any-value)]"></div>
          <div class="caret-[var(--any-value)]"></div>
          <div class="accent-[var(--any-value)]"></div>
          <div class="opacity-[var(--any-value)]"></div>
          <div class="shadow-[var(--any-value)]"></div>
          <div class="outline-[var(--any-value)]"></div>
          <div class="outline-offset-[var(--any-value)]"></div>
          <div class="ring-[var(--any-value)]"></div>
          <div class="ring-opacity-[var(--any-value)]"></div>
          <div class="ring-offset-[var(--any-value)]"></div>
          <div class="blur-[var(--any-value)]"></div>
          <div class="brightness-[var(--any-value)]"></div>
          <div class="contrast-[var(--any-value)]"></div>
          <div class="drop-shadow-[var(--any-value)]"></div>
          <div class="grayscale-[var(--any-value)]"></div>
          <div class="hue-rotate-[var(--any-value)]"></div>
          <div class="invert-[var(--any-value)]"></div>
          <div class="saturate-[var(--any-value)]"></div>
          <div class="sepia-[var(--any-value)]"></div>
          <div class="backdrop-blur-[var(--any-value)]"></div>
          <div class="backdrop-brightness-[var(--any-value)]"></div>
          <div class="backdrop-contrast-[var(--any-value)]"></div>
          <div class="backdrop-grayscale-[var(--any-value)]"></div>
          <div class="backdrop-hue-rotate-[var(--any-value)]"></div>
          <div class="backdrop-invert-[var(--any-value)]"></div>
          <div class="backdrop-opacity-[var(--any-value)]"></div>
          <div class="backdrop-saturate-[var(--any-value)]"></div>
          <div class="backdrop-sepia-[var(--any-value)]"></div>
          <div class="transition-[var(--any-value)]"></div>
          <div class="delay-[var(--any-value)]"></div>
          <div class="duration-[var(--any-value)]"></div>
          <div class="ease-[var(--any-value)]"></div>
          <div class="will-change-[var(--any-value)]"></div>
          <div class="content-[var(--any-value)]"></div>
        `,
      },
    ],
    corePlugins: { preflight: false },
  }

  let input = css`
    @tailwind utilities;
  `

  return run(input, config).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .inset-\[var\(--any-value\)\] {
        inset: var(--any-value);
      }
      .inset-x-\[var\(--any-value\)\] {
        left: var(--any-value);
        right: var(--any-value);
      }
      .inset-y-\[var\(--any-value\)\] {
        top: var(--any-value);
        bottom: var(--any-value);
      }
      .bottom-\[var\(--any-value\)\] {
        bottom: var(--any-value);
      }
      .left-\[var\(--any-value\)\] {
        left: var(--any-value);
      }
      .right-\[var\(--any-value\)\] {
        right: var(--any-value);
      }
      .top-\[var\(--any-value\)\] {
        top: var(--any-value);
      }
      .z-\[var\(--any-value\)\] {
        z-index: var(--any-value);
      }
      .order-\[var\(--any-value\)\] {
        order: var(--any-value);
      }
      .col-\[var\(--any-value\)\] {
        grid-column: var(--any-value);
      }
      .col-start-\[var\(--any-value\)\] {
        grid-column-start: var(--any-value);
      }
      .col-end-\[var\(--any-value\)\] {
        grid-column-end: var(--any-value);
      }
      .row-\[var\(--any-value\)\] {
        grid-row: var(--any-value);
      }
      .row-start-\[var\(--any-value\)\] {
        grid-row-start: var(--any-value);
      }
      .row-end-\[var\(--any-value\)\] {
        grid-row-end: var(--any-value);
      }
      .m-\[var\(--any-value\)\] {
        margin: var(--any-value);
      }
      .mx-\[var\(--any-value\)\] {
        margin-left: var(--any-value);
        margin-right: var(--any-value);
      }
      .my-\[var\(--any-value\)\] {
        margin-top: var(--any-value);
        margin-bottom: var(--any-value);
      }
      .mb-\[var\(--any-value\)\] {
        margin-bottom: var(--any-value);
      }
      .ml-\[var\(--any-value\)\] {
        margin-left: var(--any-value);
      }
      .mr-\[var\(--any-value\)\] {
        margin-right: var(--any-value);
      }
      .mt-\[var\(--any-value\)\] {
        margin-top: var(--any-value);
      }
      .aspect-\[var\(--any-value\)\] {
        aspect-ratio: var(--any-value);
      }
      .h-\[var\(--any-value\)\] {
        height: var(--any-value);
      }
      .max-h-\[var\(--any-value\)\] {
        max-height: var(--any-value);
      }
      .min-h-\[var\(--any-value\)\] {
        min-height: var(--any-value);
      }
      .w-\[var\(--any-value\)\] {
        width: var(--any-value);
      }
      .min-w-\[var\(--any-value\)\] {
        min-width: var(--any-value);
      }
      .max-w-\[var\(--any-value\)\] {
        max-width: var(--any-value);
      }
      .flex-\[var\(--any-value\)\] {
        flex: var(--any-value);
      }
      .flex-shrink-\[var\(--any-value\)\],
      .shrink-\[var\(--any-value\)\] {
        flex-shrink: var(--any-value);
      }
      .flex-grow-\[var\(--any-value\)\],
      .grow-\[var\(--any-value\)\] {
        flex-grow: var(--any-value);
      }
      .basis-\[var\(--any-value\)\] {
        flex-basis: var(--any-value);
      }
      .border-spacing-\[var\(--any-value\)\] {
        --tw-border-spacing-x: var(--any-value);
        --tw-border-spacing-y: var(--any-value);
        border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
      }
      .border-spacing-x-\[var\(--any-value\)\] {
        --tw-border-spacing-x: var(--any-value);
        border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
      }
      .border-spacing-y-\[var\(--any-value\)\] {
        --tw-border-spacing-y: var(--any-value);
        border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
      }
      .origin-\[var\(--any-value\)\] {
        transform-origin: var(--any-value);
      }
      .translate-x-\[var\(--any-value\)\] {
        --tw-translate-x: var(--any-value);
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .translate-y-\[var\(--any-value\)\] {
        --tw-translate-y: var(--any-value);
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .rotate-\[var\(--any-value\)\] {
        --tw-rotate: var(--any-value);
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .scale-\[var\(--any-value\)\] {
        --tw-scale-x: var(--any-value);
        --tw-scale-y: var(--any-value);
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .scale-x-\[var\(--any-value\)\] {
        --tw-scale-x: var(--any-value);
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .scale-y-\[var\(--any-value\)\] {
        --tw-scale-y: var(--any-value);
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
          skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
          scaleY(var(--tw-scale-y));
      }
      .animate-\[var\(--any-value\)\] {
        animation: var(--any-value);
      }
      .cursor-\[var\(--any-value\)\] {
        cursor: var(--any-value);
      }
      .scroll-m-\[var\(--any-value\)\] {
        scroll-margin: var(--any-value);
      }
      .scroll-mx-\[var\(--any-value\)\] {
        scroll-margin-left: var(--any-value);
        scroll-margin-right: var(--any-value);
      }
      .scroll-my-\[var\(--any-value\)\] {
        scroll-margin-top: var(--any-value);
        scroll-margin-bottom: var(--any-value);
      }
      .scroll-mb-\[var\(--any-value\)\] {
        scroll-margin-bottom: var(--any-value);
      }
      .scroll-ml-\[var\(--any-value\)\] {
        scroll-margin-left: var(--any-value);
      }
      .scroll-mr-\[var\(--any-value\)\] {
        scroll-margin-right: var(--any-value);
      }
      .scroll-mt-\[var\(--any-value\)\] {
        scroll-margin-top: var(--any-value);
      }
      .scroll-p-\[var\(--any-value\)\] {
        scroll-padding: var(--any-value);
      }
      .scroll-px-\[var\(--any-value\)\] {
        scroll-padding-left: var(--any-value);
        scroll-padding-right: var(--any-value);
      }
      .scroll-py-\[var\(--any-value\)\] {
        scroll-padding-top: var(--any-value);
        scroll-padding-bottom: var(--any-value);
      }
      .scroll-pb-\[var\(--any-value\)\] {
        scroll-padding-bottom: var(--any-value);
      }
      .scroll-pl-\[var\(--any-value\)\] {
        scroll-padding-left: var(--any-value);
      }
      .scroll-pr-\[var\(--any-value\)\] {
        scroll-padding-right: var(--any-value);
      }
      .scroll-pt-\[var\(--any-value\)\] {
        scroll-padding-top: var(--any-value);
      }
      .list-\[var\(--any-value\)\] {
        list-style-type: var(--any-value);
      }
      .columns-\[var\(--any-value\)\] {
        columns: var(--any-value);
      }
      .auto-cols-\[var\(--any-value\)\] {
        grid-auto-columns: var(--any-value);
      }
      .auto-rows-\[var\(--any-value\)\] {
        grid-auto-rows: var(--any-value);
      }
      .grid-cols-\[var\(--any-value\)\] {
        grid-template-columns: var(--any-value);
      }
      .grid-rows-\[var\(--any-value\)\] {
        grid-template-rows: var(--any-value);
      }
      .gap-\[var\(--any-value\)\] {
        gap: var(--any-value);
      }
      .gap-x-\[var\(--any-value\)\] {
        column-gap: var(--any-value);
      }
      .gap-y-\[var\(--any-value\)\] {
        row-gap: var(--any-value);
      }
      .space-x-\[var\(--any-value\)\] > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 0;
        margin-right: calc(var(--any-value) * var(--tw-space-x-reverse));
        margin-left: calc(var(--any-value) * calc(1 - var(--tw-space-x-reverse)));
      }
      .space-y-\[var\(--any-value\)\] > :not([hidden]) ~ :not([hidden]) {
        --tw-space-y-reverse: 0;
        margin-top: calc(var(--any-value) * calc(1 - var(--tw-space-y-reverse)));
        margin-bottom: calc(var(--any-value) * var(--tw-space-y-reverse));
      }
      .divide-y-\[var\(--any-value\)\] > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-y-reverse: 0;
        border-top-width: calc(var(--any-value) * calc(1 - var(--tw-divide-y-reverse)));
        border-bottom-width: calc(var(--any-value) * var(--tw-divide-y-reverse));
      }
      .divide-\[var\(--any-value\)\] > :not([hidden]) ~ :not([hidden]) {
        border-color: var(--any-value);
      }
      .divide-opacity-\[var\(--any-value\)\] > :not([hidden]) ~ :not([hidden]) {
        --tw-divide-opacity: var(--any-value);
      }
      .rounded-\[var\(--any-value\)\] {
        border-radius: var(--any-value);
      }
      .rounded-b-\[var\(--any-value\)\] {
        border-bottom-right-radius: var(--any-value);
        border-bottom-left-radius: var(--any-value);
      }
      .rounded-l-\[var\(--any-value\)\] {
        border-top-left-radius: var(--any-value);
        border-bottom-left-radius: var(--any-value);
      }
      .rounded-r-\[var\(--any-value\)\] {
        border-top-right-radius: var(--any-value);
        border-bottom-right-radius: var(--any-value);
      }
      .rounded-t-\[var\(--any-value\)\] {
        border-top-left-radius: var(--any-value);
        border-top-right-radius: var(--any-value);
      }
      .rounded-bl-\[var\(--any-value\)\] {
        border-bottom-left-radius: var(--any-value);
      }
      .rounded-br-\[var\(--any-value\)\] {
        border-bottom-right-radius: var(--any-value);
      }
      .rounded-tl-\[var\(--any-value\)\] {
        border-top-left-radius: var(--any-value);
      }
      .rounded-tr-\[var\(--any-value\)\] {
        border-top-right-radius: var(--any-value);
      }
      .border-\[var\(--any-value\)\] {
        border-color: var(--any-value);
      }
      .border-x-\[var\(--any-value\)\] {
        border-left-color: var(--any-value);
        border-right-color: var(--any-value);
      }
      .border-y-\[var\(--any-value\)\] {
        border-top-color: var(--any-value);
        border-bottom-color: var(--any-value);
      }
      .border-b-\[var\(--any-value\)\] {
        border-bottom-color: var(--any-value);
      }
      .border-l-\[var\(--any-value\)\] {
        border-left-color: var(--any-value);
      }
      .border-r-\[var\(--any-value\)\] {
        border-right-color: var(--any-value);
      }
      .border-t-\[var\(--any-value\)\] {
        border-top-color: var(--any-value);
      }
      .border-opacity-\[var\(--any-value\)\] {
        --tw-border-opacity: var(--any-value);
      }
      .bg-\[var\(--any-value\)\] {
        background-color: var(--any-value);
      }
      .bg-opacity-\[var\(--any-value\)\] {
        --tw-bg-opacity: var(--any-value);
      }
      .from-\[var\(--any-value\)\] {
        --tw-gradient-from: var(--any-value) var(--tw-gradient-from-position);
        --tw-gradient-to: #fff0 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
      }
      .via-\[var\(--any-value\)\] {
        --tw-gradient-to: #fff0 var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-from),
          var(--any-value) var(--tw-gradient-via-position), var(--tw-gradient-to);
      }
      .to-\[var\(--any-value\)\] {
        --tw-gradient-to: var(--any-value) var(--tw-gradient-to-position);
      }
      .fill-\[var\(--any-value\)\] {
        fill: var(--any-value);
      }
      .stroke-\[var\(--any-value\)\] {
        stroke: var(--any-value);
      }
      .object-\[var\(--any-value\)\] {
        object-position: var(--any-value);
      }
      .p-\[var\(--any-value\)\] {
        padding: var(--any-value);
      }
      .px-\[var\(--any-value\)\] {
        padding-left: var(--any-value);
        padding-right: var(--any-value);
      }
      .py-\[var\(--any-value\)\] {
        padding-top: var(--any-value);
        padding-bottom: var(--any-value);
      }
      .pb-\[var\(--any-value\)\] {
        padding-bottom: var(--any-value);
      }
      .pl-\[var\(--any-value\)\] {
        padding-left: var(--any-value);
      }
      .pr-\[var\(--any-value\)\] {
        padding-right: var(--any-value);
      }
      .pt-\[var\(--any-value\)\] {
        padding-top: var(--any-value);
      }
      .indent-\[var\(--any-value\)\] {
        text-indent: var(--any-value);
      }
      .align-\[var\(--any-value\)\] {
        vertical-align: var(--any-value);
      }
      .font-\[var\(--any-value\)\] {
        font-weight: var(--any-value);
      }
      .leading-\[var\(--any-value\)\] {
        line-height: var(--any-value);
      }
      .tracking-\[var\(--any-value\)\] {
        letter-spacing: var(--any-value);
      }
      .text-\[var\(--any-value\)\] {
        color: var(--any-value);
      }
      .text-opacity-\[var\(--any-value\)\] {
        --tw-text-opacity: var(--any-value);
      }
      .decoration-\[var\(--any-value\)\] {
        text-decoration-color: var(--any-value);
      }
      .underline-offset-\[var\(--any-value\)\] {
        text-underline-offset: var(--any-value);
      }
      .placeholder-\[var\(--any-value\)\]::placeholder {
        color: var(--any-value);
      }
      .placeholder-opacity-\[var\(--any-value\)\]::placeholder {
        --tw-placeholder-opacity: var(--any-value);
      }
      .caret-\[var\(--any-value\)\] {
        caret-color: var(--any-value);
      }
      .accent-\[var\(--any-value\)\] {
        accent-color: var(--any-value);
      }
      .opacity-\[var\(--any-value\)\] {
        opacity: var(--any-value);
      }
      .shadow-\[var\(--any-value\)\] {
        --tw-shadow-color: var(--any-value);
        --tw-shadow: var(--tw-shadow-colored);
      }
      .outline-offset-\[var\(--any-value\)\] {
        outline-offset: var(--any-value);
      }
      .outline-\[var\(--any-value\)\] {
        outline-color: var(--any-value);
      }
      .ring-\[var\(--any-value\)\] {
        --tw-ring-color: var(--any-value);
      }
      .ring-opacity-\[var\(--any-value\)\] {
        --tw-ring-opacity: var(--any-value);
      }
      .ring-offset-\[var\(--any-value\)\] {
        --tw-ring-offset-color: var(--any-value);
      }
      .blur-\[var\(--any-value\)\] {
        --tw-blur: blur(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .brightness-\[var\(--any-value\)\] {
        --tw-brightness: brightness(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .contrast-\[var\(--any-value\)\] {
        --tw-contrast: contrast(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .drop-shadow-\[var\(--any-value\)\] {
        --tw-drop-shadow: drop-shadow(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .grayscale-\[var\(--any-value\)\] {
        --tw-grayscale: grayscale(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .hue-rotate-\[var\(--any-value\)\] {
        --tw-hue-rotate: hue-rotate(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .invert-\[var\(--any-value\)\] {
        --tw-invert: invert(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .saturate-\[var\(--any-value\)\] {
        --tw-saturate: saturate(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .sepia-\[var\(--any-value\)\] {
        --tw-sepia: sepia(var(--any-value));
        filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale)
          var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia)
          var(--tw-drop-shadow);
      }
      .backdrop-blur-\[var\(--any-value\)\] {
        --tw-backdrop-blur: blur(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .backdrop-brightness-\[var\(--any-value\)\] {
        --tw-backdrop-brightness: brightness(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .backdrop-contrast-\[var\(--any-value\)\] {
        --tw-backdrop-contrast: contrast(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .backdrop-grayscale-\[var\(--any-value\)\] {
        --tw-backdrop-grayscale: grayscale(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .backdrop-hue-rotate-\[var\(--any-value\)\] {
        --tw-backdrop-hue-rotate: hue-rotate(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .backdrop-invert-\[var\(--any-value\)\] {
        --tw-backdrop-invert: invert(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .backdrop-opacity-\[var\(--any-value\)\] {
        --tw-backdrop-opacity: opacity(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .backdrop-saturate-\[var\(--any-value\)\] {
        --tw-backdrop-saturate: saturate(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .backdrop-sepia-\[var\(--any-value\)\] {
        --tw-backdrop-sepia: sepia(var(--any-value));
        backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness)
          var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate)
          var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate)
          var(--tw-backdrop-sepia);
      }
      .transition-\[var\(--any-value\)\] {
        transition-property: var(--any-value);
        transition-duration: 0.15s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      }
      .delay-\[var\(--any-value\)\] {
        transition-delay: var(--any-value);
      }
      .duration-\[var\(--any-value\)\] {
        transition-duration: var(--any-value);
      }
      .ease-\[var\(--any-value\)\] {
        transition-timing-function: var(--any-value);
      }
      .will-change-\[var\(--any-value\)\] {
        will-change: var(--any-value);
      }
      .content-\[var\(--any-value\)\] {
        --tw-content: var(--any-value);
        content: var(--tw-content);
      }
    `)
  })
})
test.todo('rewrite the any test to be easier to understand or break it up into multiple tests')
