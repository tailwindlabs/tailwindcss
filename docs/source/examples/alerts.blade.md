---
extends: _layouts.markdown
title: "Alerts"
---

# Alerts

We don't ship alert components because every app has it's own visual style, but they are easy af to make.

@foreach($page->colors as $color)
<div class="bg-{{$color}}-lightest border border-{{$color}}-light rounded p-4 mb-4">
    <div class="text-bold text-{{$color}}-dark">
        Alert message
    </div>
    <div class="text-{{$color}}-dark">
        Some additional text to explain what happened.
    </div>
</div>
@endforeach
