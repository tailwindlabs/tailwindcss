@extends('_layouts.master')

@section('body')
<div class="markdown">
    @if ($page->category)
        <div class="font-semibold text-slate-light text-base uppercase tracking-wide mb-2">{{ $page->category }}</div>
    @endif

    @yield('content')
</div>
@endsection
