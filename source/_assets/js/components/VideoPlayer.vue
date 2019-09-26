<template>
  <div class="relative bg-gray-900" style="padding-bottom: 56.25%;">
    <div class="absolute inset-0" ref="video"></div>
  </div>
</template>

<script>
import Player from '@vimeo/player'

export default {
  props: ['vimeoUrl'],
  mounted() {
    new Player(this.$refs.video, {
      url: this.vimeoUrl,
      responsive: 1,
      speed: true,
      portrait: false,
      byline: false,
      title: false,
    })
  }
}
</script>
