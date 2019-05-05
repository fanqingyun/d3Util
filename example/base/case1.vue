<template>
  <svg id ="case1" width="400" height="400"></svg>
</template>

<script>
export default {
  data () {
    return {
      dataset: [12, 11, 13]
    }
  },
  methods: {
    initSvg() {
      let svg = document.querySelector('#case1')
      console.log(svg)
      let rects = svg.select('rect')
      console.log(rects)
      console.log(rects.enter())
      console.log(rects.exits())
    }
  },
  mounted () {
    this.initSvg()
  }
}
</script>

<style>

</style>
