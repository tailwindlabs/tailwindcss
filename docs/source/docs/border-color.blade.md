---
extends: _layouts.documentation
title: "Border Color"
---

# Border Color

<div class="subnav">
    <a class="subnav-link" href="#color">Color</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
</div>

<h2 id="colors">Colors</h2>

By default, borders use the `@default-border-color`. To override a border color, add one of the border color utilities.

```html
<div class="border border-smoke-darker"></div>
<div class="border border-smoke-dark"></div>
<div class="border border-smoke"></div>

<div class="border border-white"></div>
<div class="border border-smoke-lighter"></div>
<div class="border border-smoke-light"></div>

<div class="border border-invisible"></div>
```

```less
div {
  .border-smoke-darker;
  .border-smoke-dark;
  .border-smoke;

  .border-white;
  .border-smoke-lighter;
  .border-smoke-light;

  .border-invisible;
}
```

The default border colors can also be modified using the following variables.

```less
// Variable:            Default:
@border-smoke-darker:           hsl(0, 0%, 82%);
@border-smoke-dark:      hsl(0, 0%, 90%);
@border-smoke:    hsl(0, 0%, 96%);

@border-white:          hsl(0, 0%, 100%);
@border-smoke-lighter:     hsl(0, 0%, 60%);
@border-smoke-light:   hsl(0, 0%, 35%);

@default-border-color:  @border-smoke-dark;
```
