<script>
export default {
  render() {
    return this.$scopedSlots.default({
      update: this.update,
      data: this.$data.data
    })
  },
  props: {
    initialData: { default: {} },
    created: { default: function () { return function () {} } },
    mounted: { default: function () { return function () {} } },
  },
  data() {
    return {
      data: this.$props.initialData
    }
  },
  methods: {
    update(data) {
      this.$data.data = Object.assign({}, this.$data.data, data)
    }
  },
  created() {
    this.$props.created()
  },
  mounted() {
    this.$props.mounted()
  }
}
</script>
