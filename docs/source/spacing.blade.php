@extends('_layouts.master', ['title' => 'Spacing'])

@section('body')

<h1 class="title">Spacing</h1>

<p class="mt-6 mb-3">The syntax below is combined to create a system for padding and margins. For example, <code>.pt-2</code> would add padding to the top of the element to the value of <code>0.5rem</code> and <code>.my-0</code> would make the horizontal margin zero.</p>

<div class="flex mt-6">
    <div class="pr-7">
        <div class="mb-2 text-dark-softer text-uppercase text-xs">Class</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">p</code></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">m</code></div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">pull</code></div>
    </div>
    <div class="pr-7">
        <div class="mb-2 text-dark-softer text-uppercase text-xs">Position</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">l</code> Left</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">r</code> Right</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">b</code> Bottom</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">t</code> Top</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">v</code> Vertical</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">h</code> Horizontal</div>
    </div>
    <div>
        <div class="mb-2 text-dark-softer text-uppercase text-xs">Space</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">0</code> 0</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">1</code> 0.25rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">2</code> 0.5rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">3</code> 0.75rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">4</code> 1rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">5</code> 1.5rem</div>
        <div><code class="inline-block my-1 mr-1 px-2 py-1 text-mono border rounded">6</code> 2rem</div>
    </div>
</div>



@endsection
