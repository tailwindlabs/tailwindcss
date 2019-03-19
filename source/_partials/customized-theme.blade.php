<div class="border border-gray-400 rounded mb-8 overflow-hidden">
  <div class="bg-gray-100 p-4 font-mono text-xs">
    <div class="whitespace-pre text-gray-700">{</div>
    <div class="whitespace-pre text-gray-400">  // ...</div>
    <div class="whitespace-pre text-gray-700"><span class="text-purple-700">  theme</span>: {</div>
    <div>{!! collect(explode("\n", $slot))->map(function ($line) {
      if (starts_with($line, '+')) {
        return '<div class="text-blue-700"><span class="text-blue-light">+</span>&nbsp;&nbsp;&nbsp;' . e(trim(substr($line, 1))) . '</div>';
      }
      if (starts_with($line, '-')) {
        return '<div class="text-gray-500"><span class="text-grey">-</span>&nbsp;&nbsp;&nbsp;' . e(trim(substr($line, 1))) . '</div>';
      }
      if (starts_with($line, '//')) {
        return '<div class="text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;' . e(trim($line)) . '</div>';
      }
      return '<div class="text-gray-800">&nbsp;&nbsp;&nbsp;&nbsp;' . e(trim($line)) . '</div>';
    })->implode("\n") !!}</div>
    <div class="whitespace-pre text-gray-700">  }</div>
    <div class="whitespace-pre text-gray-700">}</div>
  </div>
</div>
