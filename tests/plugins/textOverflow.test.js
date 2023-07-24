import { css, quickPluginTest } from '../util/run'

quickPluginTest('textOverflow').toMatchFormattedCss(css`
  .truncate {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .overflow-ellipsis,
  .text-ellipsis {
    text-overflow: ellipsis;
  }
  .text-clip {
    text-overflow: clip;
  }
`)
