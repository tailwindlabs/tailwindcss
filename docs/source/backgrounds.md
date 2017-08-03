---
extends: _layouts.master
title: "Backgrounds"
---

# Backgrounds

Using the utilities in HTML:

```html
<div class="bg-light"></div>
<div class="bg-light-soft"></div>
<div class="bg-light-softer"></div>
<div class="bg-light-softest"></div>

<div class="bg-dark"></div>
<div class="bg-dark-soft"></div>
<div class="bg-dark-softer"></div>
<div class="bg-dark-softest"></div>
```

Using the utilities in Less:

```less
div {
  .bg-light;
  .bg-light-soft;
  .bg-light-softer;
  .bg-light-softest;

  .bg-dark;
  .bg-dark-soft;
  .bg-dark-softer;
  .bg-dark-softest;
}
```

## Responsive

The background utitlies can also be used with <a href="/responsive">responsive</a> prefixes:

```html
<!-- Using the utilities in HTML: -->

<div class="bg-dark sm:bg-dark-soft md:bg-dark-softer lg:bg-dark-softest"></div>
```

```less
// Using the utilities in Less:

div {
  .screen(lg, {
    .bg-light;
  });
}
```


## Custom backgrounds

How to generate custom background utilities:

```less
.define-text-color('primary';
  default #3498db,
  'light' #a0cfee,
  'dark'  #2980b9
;);
```

How to use custom background utilities:

```html
<!-- Using custom utilities in HTML: -->

<div class="bg-primary"></div>
<div class="bg-primary-light"></div>
<div class="bg-primary-dark"></div>

<!-- Responsive example -->
<div class="bg-primary sm:bg-primary-dark"></div>
```

```less
// Using custom utilities in Less:

div {
  .bg-primary;
  .bg-primary-light;
  .bg-primary-dark;

  // Responsive example
  .screen(lg, {
    .bg-primary;
  });
}
```
