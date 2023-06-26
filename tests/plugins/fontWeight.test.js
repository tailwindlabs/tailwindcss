import { css, quickPluginTest } from '../util/run'

quickPluginTest('fontWeight', {
  safelist: [
    // Arbitrary values
    'font-[bold]',
    'font-[650]',
    'font-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .font-\[650\] {
    font-weight: 650;
  }
  .font-\[bold\] {
    font-weight: bold;
  }
  .font-\[var\(--my-value\)\] {
    font-weight: var(--my-value);
  }
  .font-black {
    font-weight: 900;
  }
  .font-bold {
    font-weight: 700;
  }
  .font-extrabold {
    font-weight: 800;
  }
  .font-extralight {
    font-weight: 200;
  }
  .font-light {
    font-weight: 300;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-normal {
    font-weight: 400;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-thin {
    font-weight: 100;
  }
`)
