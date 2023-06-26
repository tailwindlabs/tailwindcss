import { css, quickPluginTest } from '../util/run'

quickPluginTest('accessibility').toMatchFormattedCss(css`
  .sr-only {
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    position: absolute;
    overflow: hidden;
  }
  .not-sr-only {
    clip: auto;
    white-space: normal;
    width: auto;
    height: auto;
    margin: 0;
    padding: 0;
    position: static;
    overflow: visible;
  }
`)
