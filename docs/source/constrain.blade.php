@extends('_layouts.master', ['title' => 'Constrain'])

@section('body')

<h1 class="title">Constrain</h1>

<p class="mt-6 mb-3 text-dark-soft">The constrain utilities are simply <code>max-width</code> helpers designed to constrain content to a desired width.</p>

<p class="mt-6 mb-3">Using the utilities in HTML:</p>

<pre class="language-html"><code>{{ '<div class="constrain-xl">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>

<!-- Responsive example -->
<div class="md:constrain-xl">Lorem ipsum dolor...</div>' }}</code></pre>

<p class="mt-6 mb-3">Using the utilities in Less:</p>

<pre class="language-less"><code>div {
  .constrain-xs;
  .constrain-sm;
  .constrain-md;
  .constrain-lg;
  .constrain-xl;
  .constrain-2xl;
  .constrain-3xl;
  .constrain-4xl;
  .constrain-5xl;

  // Responsive example
  .screen(md, {
      .constrain-xl;
  });
}</code></pre>

<h2 class="subtitle">Customization</h2>

<p class="mt-6 mb-3">Tailwind exposes the following variables to allow modification of the constrain utilities.</p>

<pre class="language-less"><code>@constrain-xs:  20rem;
@constrain-sm:  30rem;
@constrain-md:  40rem;
@constrain-lg:  50rem;
@constrain-xl:  60rem;
@constrain-2xl: 70rem;
@constrain-3xl: 80rem;
@constrain-4xl: 90rem;
@constrain-5xl: 100rem;</code></pre>

@endsection
