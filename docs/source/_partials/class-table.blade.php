@php
  $scroll = isset($scroll) ? $scroll : true;
  $scroll = (count($rows) > 10 && ($scroll !== false));
@endphp

<div class="border-t border-b border-grey-light overflow-hidden relative">
  <div class="{{ $scroll ? 'max-h-sm pb-10' : '' }} overflow-y-scroll">
    <table class="w-full text-left table-collapse">
      <thead>
        <tr>
          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
        </tr>
      </thead>
      <tbody class="align-baseline">
        @foreach ($rows as $row)
        <tr>
          <td class="p-2 border-t {{ $loop->first ? 'border-grey-light' : 'border-grey-lighter' }} font-mono text-xs text-purple-dark whitespace-no-wrap">{!! $row[0] !!}</td>
          <td class="p-2 border-t {{ $loop->first ? 'border-grey-light' : 'border-grey-lighter' }} font-mono text-xs text-blue-dark whitespace-pre">{!! $row[1] !!}</td>
          <td class="p-2 border-t {{ $loop->first ? 'border-grey-light' : 'border-grey-lighter' }} text-sm text-grey-darker whitespace-no-wrap lg:whitespace-normal">{!! $row[2] !!}</td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
  @if ($scroll)
  <div class="bg-white opacity-50 text-center absolute pin-b pin-x py-2 flex justify-center shadow-md-light">
      <svg class="h-6 w-6 fill-current text-grey-dark" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
  </div>
  @endif
</div>
