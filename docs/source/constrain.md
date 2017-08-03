---
extends: _layouts.master
title: "Constrain"
---

# Constrain

The constrain utilities are simply <code class="inline">max-width</code> helpers designed to constrain content to a desired width.

```html
<!-- Using the utilities in HTML: -->

<div class="constrain-xl">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
```

```less
// Using the utilities in Less:

div {
  .constrain-xs;
  .constrain-sm;
  .constrain-md;
  .constrain-lg;
  .constrain-xl;
  .constrain-2xl;
  .constrain-3xl;
  .constrain-4xl;
  .constrain-5xl;
}
```

## Responsive

The constrain utitlies can also be used with <a href="/responsive">responsive</a> prefixes:

```html
<!-- Using the utilities in HTML: -->

<div class="constrain-xs sm:constrain-sm md:constrain-md lg:constrain-lg">Lorem ipsum dolor...</div>
```

```less
// Using the utilities in Less:

div {
  .screen(lg, {
    .constrain-lg;
  });
}
```

## Customization

Tailwind exposes the following variables to allow modification of the constrain utilities.

```less
@constrain-xs:  20rem;
@constrain-sm:  30rem;
@constrain-md:  40rem;
@constrain-lg:  50rem;
@constrain-xl:  60rem;
@constrain-2xl: 70rem;
@constrain-3xl: 80rem;
@constrain-4xl: 90rem;
@constrain-5xl: 100rem;
```
