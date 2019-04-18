<div class="w-1/2 px-2 md:w-full relative mt-4">
  <h3 class="markdown no-toc mb-4">{{ $colorName }}</h3>
  <div class="md:-mx-2 md:-mt-5 md:flex md:flex-wrap">
    @foreach (collect(range(100, 900, 100))->chunk(3) as $chunk)
      <div class="md:w-1/3 md:px-2">
        @foreach ($chunk as $variant)
        <div class="flex items-center mt-5">
          <div class="h-12 w-12 rounded-lg shadow-inner bg-{{ $color }}-{{ $variant }}"></div>
          <div class="ml-2 text-gray-800 text-xs leading-none pl-1">
            <div class="font-semibold">{{ $variant }}</div>
            <div class="mt-1 font-normal opacity-75">{{ strtoupper($page->config['theme']['colors'][$color][$variant]) }}</div>
          </div>
        </div>
        @endforeach
      </div>
    @endforeach
  </div>
</div>
