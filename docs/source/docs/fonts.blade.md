---
extends: _layouts.documentation
title: "Font Families"
---

# Font Families

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

```html
<div class="font-sans"></div>
<div class="font-serif"></div>
<div class="font-mono"></div>
```

```less
div {
  .font-sans;
  .font-serif;
  .font-mono;
}
```

```less
// Customize the font stack
@font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif;
@font-family-serif: Constantia, "Lucida Bright", Lucidabright, "Lucida Serif", Lucida, "DejaVu Serif", "Bitstream Vera Serif", "Liberation Serif", Georgia, serif;
@font-family-mono: Consolas, "Andale font-mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus font-mono L", Monaco, "Courier New", Courier, monospace;
@font-family-base: @font-family-sans;
```
