import { run, html, css } from './util/run'

test('it does something', () => {
  let config = {
    darkMode: 'class',
    content: [
      {
        raw: html`
          <!-- Not emitted, default colors have been removed -->
          <div class="text-black"></div>
          <!-- Not emitted, does not exist -->
          <div class="text-mint-100"></div>

          <!-- Below are all emitted -->
          <div class="text-mint-50"></div>
          <div class="text-mint-900"></div>
          <div class="text-plum-50"></div>
          <div class="text-plum-900"></div>
          <div class="text-primary"></div>
          <div class="text-10xl"></div>
          <div class="text-10xl/sm"></div>
          <div class="font-display"></div>
          <div class="px-1/4"></div>
          <div class="px-1/2"></div>
          <div class="px-3/4"></div>
          <div class="shadow"></div>
          <div class="animate-flash"></div>
        `,
      },
    ],
  }

  return run(
    css`
      @tailwind utilities;

      :theme {
        --colors: unset;
        --colors-mint-50: #f3fdfb;
        --colors-mint-900: #043820;
        --colors-plum-50: #f8f6fe;
        --colors-plum-900: #120c64;
        --colors-primary: theme(colors.mint-50);

        --font-family-display: Graphik, sans-serif;
        --font-family-display--font-feature-settings: "cv11", "ss01";

        --font-size-10xl: 10rem;
        --font-size-10xl--line-height: 10rem;

        --spacing-1\/4: 25%;
        --spacing-1\/2: 50%;
        --spacing-3\/4: 75%;

        --shadow--default: 0 3px 5px -2px hsl(220 3% 15% / 4%), 0 7px 14px -5px hsl(220
                3% 15% / 6%);

        --animation-flash: flash 1s;
      }
    `,
    config
  ).then((result) => {
    expect(result.css).toMatchFormattedCss(css`
      .px-1\/2 {
        padding-left: 50%;
        padding-right: 50%;
      }
      .px-1\/4 {
        padding-left: 25%;
        padding-right: 25%;
      }
      .px-3\/4 {
        padding-left: 75%;
        padding-right: 75%;
      }
      .font-display {
        font-feature-settings: "cv11", "ss01";
        font-family: Graphik, sans-serif;
      }
      .text-10xl {
        font-size: 10rem;
        line-height: 10rem;
      }
      .text-mint-50 {
        --tw-text-opacity: 1;
        color: rgb(243 253 251 / var(--tw-text-opacity));
      }
      .text-mint-900 {
        --tw-text-opacity: 1;
        color: rgb(4 56 32 / var(--tw-text-opacity));
      }
      .text-plum-50 {
        --tw-text-opacity: 1;
        color: rgb(248 246 254 / var(--tw-text-opacity));
      }
      .text-plum-900 {
        --tw-text-opacity: 1;
        color: rgb(18 12 100 / var(--tw-text-opacity));
      }
      .text-primary {
        color: #f3fdfb;
      }
      .shadow {
        --tw-shadow: 0 3px 5px -2px #2526270a, 0 7px 14px -5px #2526270f;
        --tw-shadow-colored: 0 3px 5px -2px var(--tw-shadow-color), 0 7px 14px -5px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
          var(--tw-shadow);
      }
      :root {
        --colors-mint-50: #f3fdfb;
        --colors-mint-900: #043820;
        --colors-plum-50: #f8f6fe;
        --colors-plum-900: #120c64;
        --colors-primary: #f3fdfb;
        --font-family-display: Graphik, sans-serif;
        --font-family-display--font-feature-settings: "cv11", "ss01";
        --font-size-10xl: 10rem;
        --font-size-10xl--line-height: 10rem;
        --spacing-1\/4: 25%;
        --spacing-1\/2: 50%;
        --spacing-3\/4: 75%;
        --shadow--default: 0 3px 5px -2px #2526270a, 0 7px 14px -5px #2526270f;
        --animation-flash: flash 1s;
      }
    `)
  })
})
