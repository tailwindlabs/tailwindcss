import { css, quickPluginTest } from '../util/run'

quickPluginTest('mixBlendMode').toMatchFormattedCss(css`
  .mix-blend-normal {
    mix-blend-mode: normal;
  }
  .mix-blend-multiply {
    mix-blend-mode: multiply;
  }
  .mix-blend-screen {
    mix-blend-mode: screen;
  }
  .mix-blend-overlay {
    mix-blend-mode: overlay;
  }
  .mix-blend-darken {
    mix-blend-mode: darken;
  }
  .mix-blend-lighten {
    mix-blend-mode: lighten;
  }
  .mix-blend-color-dodge {
    mix-blend-mode: color-dodge;
  }
  .mix-blend-color-burn {
    mix-blend-mode: color-burn;
  }
  .mix-blend-hard-light {
    mix-blend-mode: hard-light;
  }
  .mix-blend-soft-light {
    mix-blend-mode: soft-light;
  }
  .mix-blend-difference {
    mix-blend-mode: difference;
  }
  .mix-blend-exclusion {
    mix-blend-mode: exclusion;
  }
  .mix-blend-hue {
    mix-blend-mode: hue;
  }
  .mix-blend-saturation {
    mix-blend-mode: saturation;
  }
  .mix-blend-color {
    mix-blend-mode: color;
  }
  .mix-blend-luminosity {
    mix-blend-mode: luminosity;
  }
  .mix-blend-plus-lighter {
    mix-blend-mode: plus-lighter;
  }
`)
