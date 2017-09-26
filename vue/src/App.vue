<template>
  <div id="app">
    <header-component></header-component>
    <router-view></router-view>
  </div>
</template>

<script>
  import headerComponent from './components/realtime-project/layout/header.layout.vue'

  export default {
    name: 'app',
    components: {
      headerComponent
    }
  }
</script>

<style>
</style>
