import { css, quickPluginTest } from '../util/run'

quickPluginTest('animation', {
  safelist: [
    // Arbitrary values
    'animate-[1s_infinite_example]',
    'animate-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .animate-\[1s_infinite_example\] {
    animation: 1s infinite example;
  }
  .animate-\[var\(--my-value\)\] {
    animation: var(--my-value);
  }
  @keyframes bounce {
    0%,
    100% {
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      transform: translateY(-25%);
    }
    50% {
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      transform: none;
    }
  }
  .animate-bounce {
    animation: 1s infinite bounce;
  }
  .animate-none {
    animation: none;
  }
  @keyframes ping {
    75%,
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }
  .animate-ping {
    animation: 1s cubic-bezier(0, 0, 0.2, 1) infinite ping;
  }
  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
  .animate-pulse {
    animation: 2s cubic-bezier(0.4, 0, 0.6, 1) infinite pulse;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .animate-spin {
    animation: 1s linear infinite spin;
  }
`)
