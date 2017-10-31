---
extends: _layouts.documentation
title: "Forms"
---

# Forms

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Include documentation around:

- `input-reset` helper
- Creating input groups/custom selects and using `pointer-events-none`
- The placeholder text styling in our base styles

### Custom Select

@component('_partials.code-sample', ['lang' => 'html', 'class' => 'text-center'])
<div class="inline-block relative w-64">
    <select class="block input-reset w-full bg-white border border-smoke-dark hover:border-slate-light px-4 py-2 pr-8 rounded shadow">
        <option>Really long option that will likely overlap the chevron</option>
        <option>Option 2</option>
        <option>Option 3</option>
    </select>
    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-slate">
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
</div>
@endcomponent
