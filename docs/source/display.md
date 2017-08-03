---
extends: _layouts.master
title: "Display"
---

# Display

> If you're looking for flexbox utilities, see the [flexbox](/flexbox) page.

The display utilities simply <code class="inline">display</code> property helpers.

```html
<!-- Using the utilities in HTML: -->

<div class="block"></div>
<div class="inline-block"></div>
<div class="hidden"></div>

<div class="table">
    <div class="table-row">
        <div class="table-cell"></div>
    </div>
</div>
```

```less
// Using the utilities in Less:

div {
  .block;
  .inline-block;
  .table;
  .table-row;
  .table-cell;
  .hidden;
}
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
