<div class="relative my-8 overflow-hidden rounded shadow-md">
  <div class="relative shadow bg-{{ $color }}-500 text-{{ $color }}-{{ $breakpoint < 500 ? '100' : '900' }} px-3 py-4 md:py-1 text-sm font-semibold uppercase">{{ $colorName }}</div>
  <div class="md:flex md:flex-row-reverse">
    @foreach (range(100, 900, 100) as $variant)
    <div class="text-{{ $color }}-{{ $variant > $breakpoint ? '100' : '900' }} bg-{{ $color }}-{{ $variant }} px-2 py-4 text-xs flex-1 leading-tight">
      <div class="font-bold">{{ $variant }}</div>
      <div class="mt-1 font-normal opacity-75">{{ strtoupper($page->config['theme']['colors'][$color][$variant]) }}</div>
    </div>
    @endforeach
  </div>
</div>
