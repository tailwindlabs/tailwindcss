@foreach ($links as $link => $title)
<li class="mb-3">
    <a class="hover:underline {{ $page->active('/docs/' . $link) ? 'text-slate-darker font-bold' : 'text-slate-dark' }}" href="{{ $page->baseUrl }}/docs/{{ $link }}">
        {{ $title }}
    </a>
</li>
@endforeach
