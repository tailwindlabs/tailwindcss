<div class="border-t border-b border-grey-light">
  <div class="{{ count($rows) > 10 ? 'max-h-sm' : '' }} overflow-y-scroll">
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
          <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} font-mono text-xs text-purple-dark whitespace-no-wrap">{!! $row[0] !!}</td>
          <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} font-mono text-xs text-blue-dark whitespace-pre">{!! $row[1] !!}</td>
          <td class="p-2 border-t {{ $loop->first ? 'border-smoke' : 'border-smoke-light' }} text-sm text-grey-darker whitespace-no-wrap lg:whitespace-normal">{!! $row[2] !!}</td>
        </tr>
        @endforeach
      </tbody>
    </table>
  </div>
</div>
