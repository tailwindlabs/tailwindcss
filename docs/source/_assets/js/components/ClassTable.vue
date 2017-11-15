<template>
  <div class="border-t border-grey-lighter">
    <table class="w-full text-left table-collapse">
      <thead>
        <tr>
          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Class</th>
          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Properties</th>
          <th class="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">Description</th>
        </tr>
      </thead>
      <tbody class="align-baseline">
        <tr v-for="(row, i) in visibleRows">
          <td :class="i === 0 ? 'border-smoke' : 'border-smoke-light'" class="p-2 border-t font-mono text-xs text-purple-dark whitespace-no-wrap">{{ row[0] }}</td>
          <td :class="i === 0 ? 'border-smoke' : 'border-smoke-light'" class="p-2 border-t font-mono text-xs text-blue-dark whitespace-pre">{{ row[1] }}</td>
          <td :class="i === 0 ? 'border-smoke' : 'border-smoke-light'" class="p-2 border-t text-sm text-grey-darker">{{ row[2] }}</td>
        </tr>
      </tbody>
    </table>
    <p class="text-center py-4" v-show="!showAll && rows.length > 10">
      <span role="button" @click="showAll = true" class="text-sm text-blue hover:underline">Show all {{rows.length}}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: ['rows'],
  data() {
    return {
      showAll: false,
    }
  },
  computed: {
    visibleRows() {
      return this.showAll ? this.rows : this.rows.slice(0, 10)
    }
  }
}
</script>
