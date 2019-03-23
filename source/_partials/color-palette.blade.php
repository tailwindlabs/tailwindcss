<div class="relative my-8">
  <h3 class="markdown">{{ $colorName }}</h3>
  {{-- <div class="relative text-xl text-gray-900 font-medium">{{ $colorName }}</div> --}}
  <div class="md:-mx-2 -mt-5 md:flex md:flex-wrap">
    @foreach (range(100, 900, 100) as $variant)
    <div class="flex items-center md:w-1/3 md:px-2 mt-5">
      {{-- <div class="rounded-lg shadow-inner text-{{ $color }}-{{ $variant > $breakpoint ? '100' : '900' }} bg-{{ $color }}-{{ $variant }} px-2 py-4 text-xs leading-tight"> --}}
      <div class="h-12 w-12 rounded-lg shadow-inner bg-{{ $color }}-{{ $variant }}"></div>
      <div class="ml-2 text-gray-800 text-xs leading-none pl-1">
        <div class="font-semibold">{{ $variant }}</div>
        <div class="mt-1 font-normal opacity-75">{{ strtoupper($page->config['theme']['colors'][$color][$variant]) }}</div>
      </div>
    </div>
    @endforeach
  </div>
</div>
