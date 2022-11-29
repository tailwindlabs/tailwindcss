<script>
  let current = 'foo'
</script>

<button class:lg:hover:bg-blue-500={current === 'foo'}>Click me</button>

<button
  class:bg-red-500={current === 'foo'}
>
  Click me
</button>
