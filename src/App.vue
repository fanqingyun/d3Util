<template>
  <div>
    <Menu></Menu>
    <router-view/>
  </div>
</template>

<script>
import Menu from '../example/menu/menu'
export default {
  name: 'App',
  components: {
    Menu
  }
}
</script>