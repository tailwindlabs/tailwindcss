@php
    if (is_array($variants) && count($variants) > 0) {
        $whichVariants = "only $variants[0]";
        for ($i = 1; $i < count($variants); $i++) {
            $whichVariants .= (($i == count($variants) - 1) ? ' and ' : ', ') . $variants[$i];
        }

        $currentVariants = collect($variants);

        $extraVariants = collect([
            'responsive',
            'hover',
            'focus',
            'active',
            'group-hover',
        ])->diff($variants)
        ->take(2);
    } else {
        $whichVariants = 'no';

        $currentVariants = collect([]);

        $extraVariants = collect(['responsive', 'hover']);
    }
@endphp

<h3>Responsive and pseudo-class variants</h3>

<p>By default, {{ $whichVariants }} variants are generated for {{ $utility['name'] }} utilities.</p>

<p>You can control which variants are generated for the {{ $utility['name'] }} utilities by modifying the <code>{{ $utility['property'] }}</code> property in the <code>variants</code> section of your <code>tailwind.config.js</code> file.</p>

<p>For example, this config will {{ is_array($variants) && count($variants) > 0 ? 'also ' : '' }}generate {{ $extraVariants->implode(' and ') }} variants:</p>

@component('_partials.customized-config', ['key' => 'variants'])
  // ...
- {{ $utility['property'] }}: ['{!! $currentVariants->implode('\', \'') !!}'],
+ {{ $utility['property'] }}: ['{!! $currentVariants->merge($extraVariants)->implode('\', \'') !!}'],
@endcomponent

@isset($extraMessage)
<p>{!! $extraMessage !!}</p>
@endisset

@if(is_array($variants))
<h3>Disabling</h3>

<p>If you don't plan to use the {{ $utility['name'] }} utilities in your project, you can disable them entirely by setting the <code>{{ $utility['property'] }}</code> property to <code>false</code> in the <code>corePlugins</code> section of your config file:</p>

@component('_partials.customized-config', ['key' => 'corePlugins'])
  // ...
+ {{ $utility['property'] }}: false,
@endcomponent

@isset($extraMessage)
<p>{!! $extraMessage !!}</p>
@endisset
@endif
