---
extends: _layouts.markdown
title: "Overflow"
---

# Overflow

The overflow utilities are simply `overflow` property helpers.

```html
<div class="overflow-auto"></div>
<div class="overflow-hidden"></div>
<div class="overflow-visible"></div>
<div class="overflow-scroll"></div>
<div class="overflow-scroll-x"></div>
<div class="overflow-scroll-y"></div>
<div class="mask"></div>
```

```less


div {
  .overflow-auto;
  .overflow-hidden;
  .overflow-visible;
  .overflow-scroll;
  .overflow-scroll-x;
  .overflow-scroll-y;
  .mask;
}
```

Note that `.overflow-hidden` is available in a shorthand called `.mask`.

## Responsive

The display utitlies can also be used with <a href="/responsive">responsive</a> prefixes:

```html
<div class="overflow-auto sm:overflow-hidden md:overflow-visible lg:overflow-scroll"></div>
```

```less
div {
  .screen(lg, {
    .overflow-scroll;
  });
}
```
