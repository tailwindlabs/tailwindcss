import { css, quickPluginTest } from '../util/run'

quickPluginTest('letterSpacing', {
  safelist: [
    // Arbitrary values
    'tracking-[12px]',
    'tracking-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .-tracking-normal {
    letter-spacing: 0;
  }
  .-tracking-tight {
    letter-spacing: 0.025em;
  }
  .-tracking-tighter {
    letter-spacing: 0.05em;
  }
  .-tracking-wide {
    letter-spacing: -0.025em;
  }
  .-tracking-wider {
    letter-spacing: -0.05em;
  }
  .-tracking-widest {
    letter-spacing: -0.1em;
  }
  .tracking-\[12px\] {
    letter-spacing: 12px;
  }
  .tracking-\[var\(--my-value\)\] {
    letter-spacing: var(--my-value);
  }
  .tracking-normal {
    letter-spacing: 0;
  }
  .tracking-tight {
    letter-spacing: -0.025em;
  }
  .tracking-tighter {
    letter-spacing: -0.05em;
  }
  .tracking-wide {
    letter-spacing: 0.025em;
  }
  .tracking-wider {
    letter-spacing: 0.05em;
  }
  .tracking-widest {
    letter-spacing: 0.1em;
  }
`)
