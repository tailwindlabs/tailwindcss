import { css, quickPluginTest } from '../util/run'

quickPluginTest('backgroundImage', {
  safelist: [
    // Arbitrary values
    'bg-[url(/my-image.png)]',
  ],
}).toMatchFormattedCss(css`
  .bg-\[url\(\/my-image\.png\)\] {
    background-image: url('/my-image.png');
  }
  .bg-gradient-to-b {
    background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
  }
  .bg-gradient-to-bl {
    background-image: linear-gradient(to bottom left, var(--tw-gradient-stops));
  }
  .bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
  }
  .bg-gradient-to-l {
    background-image: linear-gradient(to left, var(--tw-gradient-stops));
  }
  .bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
  }
  .bg-gradient-to-t {
    background-image: linear-gradient(to top, var(--tw-gradient-stops));
  }
  .bg-gradient-to-tl {
    background-image: linear-gradient(to top left, var(--tw-gradient-stops));
  }
  .bg-gradient-to-tr {
    background-image: linear-gradient(to top right, var(--tw-gradient-stops));
  }
  .bg-none {
    background-image: none;
  }
`)
