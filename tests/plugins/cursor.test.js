import { css, quickPluginTest } from '../util/run'

quickPluginTest('cursor', {
  safelist: [
    // Arbitrary values
    'cursor-[url(/images/cursor.png)]',
    'cursor-[var(--my-value)]',
  ],
}).toMatchFormattedCss(css`
  .cursor-\[url\(\/images\/cursor\.png\)\] {
    cursor: url('/images/cursor.png');
  }
  .cursor-\[var\(--my-value\)\] {
    cursor: var(--my-value);
  }
  .cursor-alias {
    cursor: alias;
  }
  .cursor-all-scroll {
    cursor: all-scroll;
  }
  .cursor-auto {
    cursor: auto;
  }
  .cursor-cell {
    cursor: cell;
  }
  .cursor-col-resize {
    cursor: col-resize;
  }
  .cursor-context-menu {
    cursor: context-menu;
  }
  .cursor-copy {
    cursor: copy;
  }
  .cursor-crosshair {
    cursor: crosshair;
  }
  .cursor-default {
    cursor: default;
  }
  .cursor-e-resize {
    cursor: e-resize;
  }
  .cursor-ew-resize {
    cursor: ew-resize;
  }
  .cursor-grab {
    cursor: grab;
  }
  .cursor-grabbing {
    cursor: grabbing;
  }
  .cursor-help {
    cursor: help;
  }
  .cursor-move {
    cursor: move;
  }
  .cursor-n-resize {
    cursor: n-resize;
  }
  .cursor-ne-resize {
    cursor: ne-resize;
  }
  .cursor-nesw-resize {
    cursor: nesw-resize;
  }
  .cursor-no-drop {
    cursor: no-drop;
  }
  .cursor-none {
    cursor: none;
  }
  .cursor-not-allowed {
    cursor: not-allowed;
  }
  .cursor-ns-resize {
    cursor: ns-resize;
  }
  .cursor-nw-resize {
    cursor: nw-resize;
  }
  .cursor-nwse-resize {
    cursor: nwse-resize;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .cursor-progress {
    cursor: progress;
  }
  .cursor-row-resize {
    cursor: row-resize;
  }
  .cursor-s-resize {
    cursor: s-resize;
  }
  .cursor-se-resize {
    cursor: se-resize;
  }
  .cursor-sw-resize {
    cursor: sw-resize;
  }
  .cursor-text {
    cursor: text;
  }
  .cursor-vertical-text {
    cursor: vertical-text;
  }
  .cursor-w-resize {
    cursor: w-resize;
  }
  .cursor-wait {
    cursor: wait;
  }
  .cursor-zoom-in {
    cursor: zoom-in;
  }
  .cursor-zoom-out {
    cursor: zoom-out;
  }
`)
