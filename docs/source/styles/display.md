---
extends: _layouts.markdown
title: "Display"
---

# Display

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

> If you're looking for Flexbox utilities, see the [Flexbox](/styles/flexbox) page.

The display utilities simply `display` property helpers.

```html
<!-- Using the utilities in HTML: -->

<div class="inline"></div>
<div class="block"></div>
<div class="inline-block"></div>
<div class="hidden"></div>

<div class="table">
    <div class="table-row">
        <div class="table-cell"></div>
    </div>
</div>
```

## Responsive

The display utitlies can also be used with <a href="/responsive">responsive</a> prefixes:

```html
<!-- Using the utilities in HTML: -->

<div class="block sm:inline-block md:block lg:hidden"></div>
```

```less
// Using the utilities in Less:

div {
  .screen(lg, {
    .inline-block;
  });
}
```
