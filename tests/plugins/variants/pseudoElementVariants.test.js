import { css, quickVariantPluginTest } from '../../util/run'

quickVariantPluginTest('pseudoElementVariants').toMatchFormattedCss(css`
  .first-letter\:flex:first-letter,
  .first-line\:flex:first-line,
  .marker\:flex ::marker,
  .marker\:flex::marker {
    display: flex;
  }
  .selection\:flex ::selection {
    display: flex;
  }
  .selection\:flex::selection {
    display: flex;
  }
  .file\:flex::-webkit-file-upload-button {
    display: flex;
  }
  .file\:flex::file-selector-button {
    display: flex;
  }
  .placeholder\:flex::placeholder {
    display: flex;
  }
  .backdrop\:flex::-webkit-backdrop {
    display: flex;
  }
  .backdrop\:flex::backdrop {
    display: flex;
  }
  .before\:flex:before,
  .after\:flex:after {
    content: var(--tw-content);
    display: flex;
  }
`)
