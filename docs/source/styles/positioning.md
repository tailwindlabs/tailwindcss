---
extends: _layouts.markdown
title: "Positioning"
---

# Positioning

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

The position utilities are primarily `position` property helpers.

```html
<!-- Using the utilities in HTML: -->

<div class="fixed"></div>
<div class="absolute"></div>
<div class="relative"></div>
```

```less
// Using the utilities in Less:

div {
  .fixed;
  .absolute;
  .relative;
}
```

## Pinning absolute content

Tailwind also provides pin utilties, useful for "pinning" absolutely positioned elements using the `top`, `right`, `bottom` and `left` properties.

```html
<!-- Using the utilities in HTML: -->

<div class="relative">
    <div class="absolute pin-t"></div>
</div>
```

```less
// Using the utilities in Less:

div {
  .pin;
  .pin-t;
  .pin-r;
  .pin-b;
  .pin-l;
  .pin-x;
  .pin-y;
}
```

## Responsive

The position utitlies can also be used with <a href="/responsive">responsive</a> prefixes:

```html
<!-- Using the utilities in HTML: -->

<div class="fixed sm:absolute md:relative"></div>
```

```less
// Using the utilities in Less:

div {
  .screen(md, {
    .relative;
  });
}
```
