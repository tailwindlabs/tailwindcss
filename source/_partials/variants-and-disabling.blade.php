@php
    $whichVariants = "only $variants[0]";
    for ($i = 1; $i < count($variants); $i++) {
        $whichVariants .= (($i == count($variants) - 1) ? ' and ' : ', ') . $variants[$i];
    }

    $currentVariants = '\'' . collect($variants)->implode('\', \'') . '\'';

    $extraVariants = collect([
        'responsive',
        'hover',
        'focus',
        'group-hover',
    ])->diff($variants)
    ->take(3 - count($variants))
    ->implode(' and ');
@endphp

<h3>Responsive, Hover, and Focus Variants</h3>

<p>By default, {{ $whichVariants }} variants are generated for {{ $utility['name'] }} utilities.</p>

<p>You can control which variants are generated for the {{ $utility['name'] }} utilities by modifying the <code>{{ $utility['property'] }}</code> property in the <code>modules</code> section of your Tailwind config file.</p>

<p>For example, this config will also generate {{ $extraVariants }} variants:</p>

@component('_partials.customized-config', ['key' => 'modules'])
  // ...
- {{ $utility['property'] }}: [{{$currentVariants}}],
+ {{ $utility['property'] }}: ['responsive', 'hover', 'focus'],
@endcomponent

@isset($extraMessage)
<p>{!! $extraMessage !!}</p>
@endif

<h3>Disabling</h3>

<p>If you don't plan to use the {{ $utility['name'] }} utilities in your project, you can disable them entirely by setting the <code>{{ $utility['property'] }}</code> property to <code>false</code> in the <code>modules</code> section of your config file:</p>

@component('_partials.customized-config', ['key' => 'modules'])
  // ...
- {{ $utility['property'] }}: [{{$currentVariants}}],
+ {{ $utility['property'] }}: false,
@endcomponent

@isset($extraMessage)
<p>{!! $extraMessage !!}</p>
@endif
