import { css, quickPluginTest } from '../util/run'

quickPluginTest('backgroundBlendMode').toMatchFormattedCss(css`
  .bg-blend-normal {
    background-blend-mode: normal;
  }
  .bg-blend-multiply {
    background-blend-mode: multiply;
  }
  .bg-blend-screen {
    background-blend-mode: screen;
  }
  .bg-blend-overlay {
    background-blend-mode: overlay;
  }
  .bg-blend-darken {
    background-blend-mode: darken;
  }
  .bg-blend-lighten {
    background-blend-mode: lighten;
  }
  .bg-blend-color-dodge {
    background-blend-mode: color-dodge;
  }
  .bg-blend-color-burn {
    background-blend-mode: color-burn;
  }
  .bg-blend-hard-light {
    background-blend-mode: hard-light;
  }
  .bg-blend-soft-light {
    background-blend-mode: soft-light;
  }
  .bg-blend-difference {
    background-blend-mode: difference;
  }
  .bg-blend-exclusion {
    background-blend-mode: exclusion;
  }
  .bg-blend-hue {
    background-blend-mode: hue;
  }
  .bg-blend-saturation {
    background-blend-mode: saturation;
  }
  .bg-blend-color {
    background-blend-mode: color;
  }
  .bg-blend-luminosity {
    background-blend-mode: luminosity;
  }
`)
