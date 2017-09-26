<template>
  <div id="app">
    <header-component></header-component>
    <kanban></kanban>
  </div>
</template>

<script>
  import headerComponent from './components/layout/header.layout.vue'
  import kanban from './components/view/kanban/kanban.view.vue'

  export default {
    name: 'app',
    components: {
      headerComponent,
      kanban
    }
  }
</script>

<style>
</style>
