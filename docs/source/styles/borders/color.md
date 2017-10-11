---
extends: _layouts.markdown
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
<div class="border border-dark"></div>
<div class="border border-dark-soft"></div>
<div class="border border-dark-softer"></div>

<div class="border border-light"></div>
<div class="border border-light-soft"></div>
<div class="border border-light-softer"></div>

<div class="border border-invisible"></div>
```

```less
div {
  .border-dark;
  .border-dark-soft;
  .border-dark-softer;

  .border-light;
  .border-light-soft;
  .border-light-softer;

  .border-invisible;
}
```

The default border colors can also be modified using the following variables.

```less
// Variable:            Default:
@border-dark:           hsl(0, 0%, 82%);
@border-dark-soft:      hsl(0, 0%, 90%);
@border-dark-softer:    hsl(0, 0%, 96%);

@border-light:          hsl(0, 0%, 100%);
@border-light-soft:     hsl(0, 0%, 60%);
@border-light-softer:   hsl(0, 0%, 35%);

@default-border-color:  @border-dark-soft;
```
