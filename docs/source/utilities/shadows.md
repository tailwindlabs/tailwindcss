---
extends: _layouts.markdown
title: "Shadows"
---

# Shadows

Box shadows can be applied using the shadow utilities. By default these are a linear scale, where the lower values represent smaller (shallow) shadows, and higher values represent bigger (deeper) shadows.

<div class="flex text-sm my-6">
    <div class="mr-3 p-4 shadow-1">.shadow-1</div>
    <div class="mr-3 p-4 shadow-2">.shadow-2</div>
    <div class="p-4 shadow-3">.shadow-3</div>
</div>

```html
<div class="shadow-1"></div>
<div class="shadow-2"></div>
<div class="shadow-3"></div>
```

```less
div {
  .shadow-1;
  .shadow-2;
  .shadow-3;
}
```

### Customizing shadows

You can customize the shadow utilities using the `@shadows` variable. Please note that the entire scale must be redefined. It's not possible to add a new value to the existing scale. Shadows can be defined with multiple `box-shadow` values, as illustrated below.

```less
// The default shadows scale
@shadows:
  '1' ~"0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  '2' ~"0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
  '3' ~"0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  '4' ~"0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  '5' ~"0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
;
```
