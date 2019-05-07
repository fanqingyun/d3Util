<template>
  <ul>
    <li v-for="(item, key) in routes" :key="key"><router-link :to="item.path">{{item.name}}</router-link></li>
  </ul>
</template>

<script>
import Router from '@/router/index.js'
export default {
  data () {
    return {
      routes: []
    }
  },
  mounted () {
    this.routes = Router.options.routes
  }
}
</script>

<style>

</style>
