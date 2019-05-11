---
extends: _layouts.documentation
title: "Customizing Spacing"
description: "Customizing the default spacing scale for your project."
titleBorder: true
---

@include('_partials.work-in-progress')

The `theme.spacing` property allows you to override Tailwind's default spacing/sizing scale.

```js
// tailwind.config.js
module.exports = {
  theme: {
    spacing: {
      '1': '8px',
      '2': '12px',
      '3': '16px',
      '4': '24px',
      '5': '32px',
      '6': '48px',
    }
  }
}
```

By default the spacing scale is shared by the `padding`, `margin`, `negativeMargin`, `width`, and `height` utilities. The above configuration would generate classes like `.p-2`, `.mt-3`, `.-mx-4`, `.w-5`, `.h-6`, etc.
