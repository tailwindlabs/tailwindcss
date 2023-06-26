import { css, quickPluginTest } from '../util/run'

quickPluginTest('backgroundAttachment').toMatchFormattedCss(css`
  .bg-fixed {
    background-attachment: fixed;
  }
  .bg-local {
    background-attachment: local;
  }
  .bg-scroll {
    background-attachment: scroll;
  }
`)
