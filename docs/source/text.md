---
extends: _layouts.master
title: "Text"
---

# Text

<div class="subnav">
    <a class="subnav-link" href="#font-family">Family</a>
    <a class="subnav-link" href="#font-sizes">Sizes</a>
    <a class="subnav-link" href="#font-weight">Weight</a>
    <a class="subnav-link" href="#colors">Colors</a>
    <a class="subnav-link" href="#alignment">Alignment</a>
    <a class="subnav-link" href="#styles">Styles</a>
    <a class="subnav-link" href="#line-height">Line height</a>
    <a class="subnav-link" href="#letter-spacing">Letter spacing</a>
</div>

<h2 id="font-family">Font family</h2>

```html
<div class="text-mono"></div>
```

```less
div {
  .text-mono;
}
```

```less
// Customize the font stack
@system-font-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif;
@font-family-base: @system-font-stack;
@font-family-mono: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;
```

<h2 id="font-sizes">Font sizes</h2>

```html
<div class="text-xs"></div>
<div class="text-sm"></div>
<div class="text-base"></div>
<div class="text-lg"></div>
<div class="text-xl"></div>
<div class="text-2xl"></div>
<div class="text-3xl"></div>
```

```less
div {
  .text-xs;
  .text-sm;
  .text-base;
  .text-lg;
  .text-xl;
  .text-2xl;
  .text-3xl;
}
```

```less
// Customize the text size scale
@text-size-scale:
  'xs' @font-size-xs,
  'sm' @font-size-sm,
  'base' @font-size-base,
  'lg' @font-size-lg,
  'xl' @font-size-xl,
  '2xl' @font-size-2xl,
  '3xl' @font-size-3xl,
;
```

<h2 id="font-weight">Font weight</h2>

```html
<div class="text-hairline"></div>
<div class="text-thin"></div>
<div class="text-regular"></div>
<div class="text-medium"></div>
<div class="text-bold"></div>
```

```less
div {
  .text-hairline;
  .text-thin;
  .text-regular;
  .text-medium;
  .text-bold;
}
```

```less
// Customize the text weight scale
@text-weight-scale:
  'hairline' 200,
  'thin' 300,
  'regular' 400,
  'medium' 600,
  'bold' 700,
;
```

<h2 id="colors">Colors</h2>

```html
<div class="text-light"></div>
<div class="text-light-soft"></div>
<div class="text-light-softer"></div>
<div class="text-light-softest"></div>

<div class="text-dark"></div>
<div class="text-dark-soft"></div>
<div class="text-dark-softer"></div>
<div class="text-dark-softest"></div>
```

```less
div {
  .text-light;
  .text-light-soft;
  .text-light-softer;
  .text-light-softest;

  .text-dark;
  .text-dark-soft;
  .text-dark-softer;
  .text-dark-softest;
}
```

```less
// Customize the text colors
@text-colors:
  'light' hsl(0, 0%, 100%),
  'light-soft' hsl(0, 0%, 60%),
  'light-softer' hsl(0, 0%, 45%),
  'light-softest' hsl(0, 0%, 35%),

  'dark' hsl(0, 0%, 25%),
  'dark-soft' hsl(0, 0%, 50%),
  'dark-softer' hsl(0, 0%, 65%),
  'dark-softest' hsl(0, 0%, 75%),
;
```

<h2 id="alignment">Alignment</h2>

```less
div {
  // Horizontal
  .text-center;
  .text-left;
  .text-right;
  .text-justify;

  // Vertical
  .align-baseline;
  .align-top;
  .align-middle;
  .align-bottom;
  .align-text-top;
  .align-text-bottom;
}
```

<h2 id="styles">Styles</h2>

```less
div { .text-em; }            // Italic
div { .text-uppercase; }     // Uppercase
div { .text-underline; }     // Underline
div { .text-break; }         // Pre line
div { .text-no-wrap; }       // No wrap
div { .text-force-wrap; }    // Break word
div { .text-smooth; }        // Anti-aliased
div { .text-strike; }        // Line through
div { .text-ellipsis; }      // Overflow ellipsis
div { .text-shadow-solid; }  // Shadow
```

<h2 id="line-height">Line height</h2>

```html
<div class="leading-none"></div>
<div class="leading-tight"></div>
<div class="leading-normal"></div>
<div class="leading-loose"></div>
```

```less
div {
  .leading-none;
  .leading-tight;
  .leading-normal;
  .leading-loose;
}
```

```less
// Set the default line height
@line-height: 1.5;

// Customize the leading scale
@leading-scale:
  'none' 1,
  'tight' 1.25,
  'normal' 1.5,
  'loose' 2,
;
```

<h2 id="letter-spacing">Letter spacing</h2>

```html
<div class="tracking-tight"></div>
<div class="tracking-normal"></div>
<div class="tracking-wide"></div>
```

```less
div {
  .tracking-tight;
  .tracking-normal;
  .tracking-wide;
}
```

```less
// Customize the tracking scale
@tracking-scale:
  'tight' -0.05em,
  'normal' 0,
  'wide' 0.1em,
;
```
