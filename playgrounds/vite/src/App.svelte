<script>
  let name = 'world'
</script>

<h1 class="foo any-hover:text-red-500">Hello {name}!</h1>

<style lang="postcss">
  @import 'tailwindcss';
  .foo {
    @apply underline;
  }

  @variant any-hover {
    &:hover {
      @slot;
    }
  }
</style>
