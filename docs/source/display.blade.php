@extends('_layouts.master', ['title' => 'Display'])

@section('body')

<h1 class="title">Display</h1>

<p class="mt-6 mb-3 text-dark-soft">The display utilities simply <code>display</code> property helpers.</p>

<p class="mt-6 mb-3">Using the utilities in HTML:</p>

<pre class="language-html"><code>{{ '<div class="block"></div>
<div class="inline-block"></div>
<div class="hidden"></div>

<div class="table">
    <div class="table-row">
        <div class="table-cell"></div>
    </div>
</div>

<!-- Responsive example -->
<div class="lg:inline-block"></div>' }}</code></pre>

<p class="mt-6 mb-3">Using the utilities in Less:</p>

<pre class="language-less"><code>div {
  .block;
  .inline-block;
  .table;
  .table-row;
  .table-cell;
  .hidden;

  // Responsive example
  .screen(lg, {
      .inline-block;
  });
}</code></pre>

@endsection
