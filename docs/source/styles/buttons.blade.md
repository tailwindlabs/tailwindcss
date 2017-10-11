---
extends: _layouts.markdown
title: "Buttons"
---

# Buttons

<div class="subnav">
    <a class="subnav-link" href="#usage">Usage</a>
    <a class="subnav-link" href="#responsive">Responsive</a>
    <a class="subnav-link" href="#customizing">Customizing</a>
</div>

Document how to create buttons of various styles, like solid rounded buttons, outline buttons, pill buttons, etc.

### Solid

<div class="mb-4">
    <button class="text-medium text-dark rounded py-2 px-4 bg-light mr-4">
        Save
    </button>
    <button class="text-medium text-dark rounded py-2 px-4 bg-light-soft mr-4">
        Save
    </button>
    <button class="text-medium text-dark rounded py-2 px-4 bg-light-softer mr-4">
        Save
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-dark-soft mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-dark-softer mr-4">
        Save
    </button>
</div>

@foreach($page->colors as $color)
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-{{$color}} hover:bg-{{$color}}-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-{{$color}}-light mr-4">
        Disabled
    </button>
</div>
@endforeach

<h3 class="markdown">Outline</h3>

@foreach($page->colors as $color)
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 text-{{$color}}-dark hover:text-light border border-{{$color}} hover:bg-{{$color}} mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 text-{{$color}}-light border border-{{$color}}-light mr-4">
        Disabled
    </button>
</div>
@endforeach
