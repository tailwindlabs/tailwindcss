<div class="rounded-lg mb-8 overflow-hidden">
  <div class="bg-gray-800 p-4 font-mono text-sm overflow-x-scroll whitespace-no-wrap">
    <div class="whitespace-pre text-gray-200">{</div>
    <div class="whitespace-pre text-gray-400">  // ...</div>
    <div class="whitespace-pre text-gray-200"><span style="color: #f9ee98;">  {{ $key }}</span>: {</div>
    <div>{!! collect(explode("\n", $slot))->map(function ($line) {
      if (starts_with($line, '+')) {
        return '<div style="color: #a8ff60;"><span>+</span>&nbsp;&nbsp;&nbsp;' . e(trim(substr($line, 1))) . '</div>';
      }
      if (starts_with($line, '-')) {
        return '<div class="text-gray-500"><span class="text-gray-500">-</span>&nbsp;&nbsp;&nbsp;' . e(trim(substr($line, 1))) . '</div>';
      }
      if (starts_with($line, '//')) {
        return '<div class="text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;' . e(trim($line)) . '</div>';
      }
      return '<div class="text-gray-300">&nbsp;&nbsp;&nbsp;&nbsp;' . e(trim($line)) . '</div>';
    })->implode("\n") !!}</div>
    <div class="whitespace-pre text-gray-200">  }</div>
    <div class="whitespace-pre text-gray-200">}</div>
  </div>
</div>
