@php
  $scroll = isset($scroll) ? $scroll : true;
  $scroll = (count($rows) > 12 && ($scroll !== false));
@endphp

<h2 style="visibility: hidden; font-size: 0; margin: 0;">Class reference</h2>
<div class="border-t border-b border-gray-300 overflow-hidden relative">
  <div class="{{ $scroll ? 'lg:max-h-xs' : '' }} overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch">
    <table class="relative w-full text-left table-collapse">
      <thead>
        <tr>
          <th class="z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0">
            <div class="p-2 border-b border-gray-300">Class</div>
          </th>
          <th class="relative z-20 sticky top-0 text-sm font-semibold text-gray-700 bg-gray-100 p-0" colspan="2">
            <div class="sm:hidden absolute inset-0 p-2 border-b border-gray-300"></div>
            <div class="hidden sm:block p-2 border-b border-gray-300">Properties</div>
          </th>
        </tr>
      </thead>
      <tbody class="align-baseline">
        @foreach ($rows as $row)
        <tr>
          <td class="p-2 {{ $loop->first ? '' : 'border-t border-gray-200' }} font-mono text-xs text-purple-700 whitespace-no-wrap">{!! $row[0] !!}</td>
          <td class="hidden sm:table-cell p-2 {{ $loop->first ? '' : 'border-t border-gray-200' }} font-mono text-xs text-blue-700 whitespace-pre">{!! $row[1] !!}</td>
          <td class="w-24 p-2 font-mono text-xs text-blue-700 whitespace-pre {!! substr($row[0], 1) !!}" {!! $row[0] === '.bg-transparent' ? 'style="background-image: url(\'/img/transparent-bg.svg\')"' : '' !!}></td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>
