<div class=" overflow-hidden">
  {{-- <div class="text-black bg-{{ $colors['Base']['name'] }} px-3 py-2 text-sm font-semibold flex justify-between"> --}}
    {{-- <div class="uppercase">{{ $colorName }}</div> --}}
    {{-- <div class="flex justify-between"> --}}
      {{-- <span class='mr-2'>Base</span> --}}
      {{-- <span class="font-normal opacity-75">{{ strtoupper($page->config['colors'][$colors['Base']['name']]) }}</span> --}}
    {{-- </div> --}}
  {{-- </div> --}}
  <div class="flex">
    @foreach ($colors as $variant => $color)
    <div class="text-{{ $color['fg'] }} bg-{{ $color['name'] }} px-3 py-4 text-sm flex-1 font-semibold leading-tight">
      <div>{{ $colorName }}</div>
      <div class="mb-2">{{ $variant }}</div>
      <div class="font-normal opacity-75">{{ strtoupper($page->config['colors'][$color['name']]) }}</div>
    </div>
    @endforeach
  </div>
</div>
