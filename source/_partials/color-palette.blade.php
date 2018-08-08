<div class="relative my-8 overflow-hidden rounded shadow-md1">
  <div class="relative shadow bg-{{ $colors['Base']['name'] }} text-{{ $colors['Base']['fg'] }} px-3 py-4 md:py-1 text-sm font-semibold flex justify-between">
    <div class="uppercase">{{ $colorName }}</div>
    <div class="flex justify-between">
      <span class='mr-2'>Base</span>
      <span class="font-normal opacity-75">{{ strtoupper($page->config['colors'][$colors['Base']['name']]) }}</span>
    </div>
  </div>
  <div class="md:flex md:flex-row-reverse">
    @foreach ($colors as $variant => $color)
    <div class="text-{{ $color['fg'] }} bg-{{ $color['name'] }} px-3 py-4 text-sm flex-1 font-semibold leading-tight">
      {{-- <div>{{ $colorName }}</div> --}}
      <div class="mb-2">{{ $variant }}</div>
      <div class="font-normal opacity-75">{{ strtoupper($page->config['colors'][$color['name']]) }}</div>
    </div>
    @endforeach
  </div>
</div>
