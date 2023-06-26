import { css, quickPluginTest } from '../util/run'

quickPluginTest('aspectRatio').toMatchFormattedCss(css`
  .aspect-auto {
    aspect-ratio: auto;
  }
  .aspect-square {
    aspect-ratio: 1;
  }
  .aspect-video {
    aspect-ratio: 16 / 9;
  }
`)
